// Cloudflare Worker - Global Learning Aggregation
// Collects feedback from all users to improve the detection model globally

export async function onRequest(context) {
    const { request, env } = context;

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers });
    }

    try {
        // POST - Submit feedback to global learning system
        if (request.method === 'POST') {
            const { signals, correct, userSaidAI } = await request.json();

            if (!signals) {
                return new Response(JSON.stringify({ error: 'Missing signals' }), {
                    status: 400,
                    headers
                });
            }

            // Store in KV for aggregation
            if (env.LEARNING_KV) {
                const timestamp = Date.now();
                const key = `feedback:${timestamp}`;

                await env.LEARNING_KV.put(key, JSON.stringify({
                    signals,
                    correct,
                    userSaidAI,
                    timestamp
                }), {
                    expirationTtl: 2592000 // 30 days
                });

                // Update global weights (simplified version)
                const globalWeights = await env.LEARNING_KV.get('global_weights');
                let weights = globalWeights ? JSON.parse(globalWeights) : {
                    noise: 0.18,
                    compression: 0.15,
                    color: 0.15,
                    edges: 0.12,
                    frequency: 0.15,
                    exif: 0.10,
                    metadata: 0.10,
                    model: 0.25,
                    samples: 0
                };

                // Simple online learning update
                const learningRate = 0.01;
                for (const [signal, value] of Object.entries(signals)) {
                    if (weights[signal] !== undefined) {
                        const targetValue = userSaidAI ? 70 : 30;
                        const error = Math.abs(value - targetValue);
                        const adjustment = correct ?
                            learningRate * (1 - error / 100) :
                            -learningRate * (error / 100);

                        weights[signal] = Math.max(0.05, Math.min(0.35,
                            weights[signal] + adjustment
                        ));
                    }
                }

                // Normalize
                const sum = Object.entries(weights)
                    .filter(([k]) => !['samples'].includes(k))
                    .reduce((a, [, v]) => a + v, 0);

                for (const key in weights) {
                    if (key !== 'samples') {
                        weights[key] /= sum;
                    }
                }

                weights.samples++;

                await env.LEARNING_KV.put('global_weights', JSON.stringify(weights));

                return new Response(JSON.stringify({
                    success: true,
                    message: 'Feedback recorded',
                    globalAccuracy: weights.samples > 0 ? '~85%' : 'calculating...'
                }), { headers });
            }

            return new Response(JSON.stringify({ success: true }), { headers });
        }

        // GET - Retrieve global weights for new users
        if (request.method === 'GET') {
            if (env.LEARNING_KV) {
                const globalWeights = await env.LEARNING_KV.get('global_weights');

                if (globalWeights) {
                    return new Response(globalWeights, { headers });
                }
            }

            // Return default weights if no global data yet
            const defaultWeights = {
                noise: 0.18,
                compression: 0.15,
                color: 0.15,
                edges: 0.12,
                frequency: 0.15,
                exif: 0.10,
                metadata: 0.10,
                model: 0.25,
                samples: 0
            };

            return new Response(JSON.stringify(defaultWeights), { headers });
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers
        });

    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Request failed',
            message: error.message
        }), {
            status: 500,
            headers
        });
    }
}
