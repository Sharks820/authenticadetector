# Detection Module

**CRITICAL: DO NOT MODIFY WITHOUT PM APPROVAL**

This directory will contain the AI detection core logic after migration.

## Planned Structure

```
detection/
├── index.js           # Module entry point
├── heuristics.js      # Heuristic analysis functions
│   - analyzeNoisePatterns()
│   - analyzeCompressionArtifacts()
│   - analyzeColorDistribution()
│   - analyzeEdgeCoherence()
│   - analyzeFrequencyDomain()
├── models.js          # AI model loading
│   - loadProductionModels()
│   - analyzeDeepfakeOutput()
│   - analyzeCLIP()
├── ensemble.js        # Ensemble scoring
│   - runQuickScan()
│   - runDeepScan()
│   - Multi-signal aggregation
└── signatures.js      # Generator detection
    - detectGeneratorSignatures()
    - Midjourney, DALL-E, Stable Diffusion patterns
```

## Current Location

All detection functions are in `index.html`:
- Lines 1771-2191: Scan functions
- Lines 2193-2362: Model analysis
- Lines 2366-3052: Heuristic analysis

## Safety Requirements

Before extracting this module:
1. Create comprehensive test suite
2. Document all function signatures
3. Verify output matches for test images
4. Obtain PM-Integrator approval

## DO NOT MODIFY

The functions in this module are core to the application's value proposition.
Any changes must be:
1. Measured before/after
2. Tested extensively
3. Approved by PM-Integrator
