#!/usr/bin/env python3
"""
Script to integrate modern scan results design into index.html
Replaces old result card CSS and HTML with modern glassmorphic design
"""

import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the CSS for result card (lines 685-724)
old_css = r'''        /\* RESULT CARD \*/
        \.result-card\{
            background:var\(--surface\);border-radius:16px;
            padding:16px;margin:10px 16px;position:relative;overflow:hidden;
        \}
        \.result-glow\{
            position:absolute;top:-50%;left:-50%;width:200%;height:200%;
            opacity:\.12;pointer-events:none;
        \}
        \.result-header\{
            display:flex;align-items:flex-start;gap:12px;
            margin-bottom:12px;position:relative;z-index:1;
        \}
        \.result-icon\{
            width:50px;height:50px;border-radius:12px;
            display:flex;align-items:center;justify-content:center;font-size:24px;
        \}
        \.result-icon\.fake\{background:linear-gradient\(135deg,var\(--danger\),#ff6b7a\)\}
        \.result-icon\.real\{background:linear-gradient\(135deg,var\(--success\),#7bed9f\)\}
        \.result-icon\.uncertain\{background:linear-gradient\(135deg,var\(--warning\),#ffc048\)\}
        \.result-info\{flex:1\}
        \.result-label\{font-size:16px;font-weight:800;margin-bottom:2px\}
        \.result-sublabel\{font-size:11px;color:var\(--text2\)\}

        \.confidence-badge\{
            display:inline-flex;align-items:center;gap:4px;
            padding:4px 8px;border-radius:12px;font-size:10px;font-weight:700;margin-bottom:8px;
        \}
        \.confidence-high\{background:rgba\(46,213,115,\.15\);color:var\(--success\)\}
        \.confidence-medium\{background:rgba\(255,165,2,\.15\);color:var\(--warning\)\}
        \.confidence-low\{background:rgba\(255,71,87,\.15\);color:var\(--danger\)\}

        \.result-score\{margin-bottom:12px\}
        \.score-bar\{height:8px;background:var\(--surface2\);border-radius:4px;overflow:hidden\}
        \.score-fill\{height:100%;border-radius:4px;transition:width \.5s\}
        \.score-fill\.fake\{background:linear-gradient\(90deg,var\(--danger\),#ff6b7a\)\}
        \.score-fill\.real\{background:linear-gradient\(90deg,var\(--success\),#7bed9f\)\}
        \.score-fill\.uncertain\{background:linear-gradient\(90deg,var\(--warning\),#ffc048\)\}
        \.score-labels\{display:flex;justify-content:space-between;margin-top:4px;font-size:9px;color:var\(--text3\)\}
        \.score-value\{text-align:center;font-size:13px;font-weight:700;margin-top:6px\}'''

new_css = '''        /* MODERN RESULT CARD - Glassmorphic Design */
        .result-card{
            background:linear-gradient(135deg,var(--surface) 0%,var(--surface2) 100%);
            backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);
            border-radius:24px;padding:24px;margin:10px 16px;position:relative;overflow:hidden;
            box-shadow:0 8px 32px rgba(0,0,0,0.3);
        }
        .result-glow{
            position:absolute;top:-50%;right:-20%;width:300px;height:300px;
            background:radial-gradient(circle,rgba(0,212,170,0.35) 0%,transparent 70%);
            border-radius:50%;filter:blur(30px);pointer-events:none;
        }

        /* VERDICT HEADER - Large, Prominent */
        .result-header{
            display:flex;align-items:center;gap:16px;margin-bottom:24px;
            padding-bottom:20px;border-bottom:1px solid var(--border);position:relative;z-index:1;
        }
        .result-icon{
            width:80px;height:80px;border-radius:20px;
            display:flex;align-items:center;justify-content:center;font-size:40px;
            flex-shrink:0;box-shadow:0 8px 24px rgba(0,0,0,0.3);
            animation:verdict-bounce .6s cubic-bezier(.34,1.56,.64,1);
        }
        .result-icon.fake{background:linear-gradient(135deg,var(--danger),#ff6b7a)}
        .result-icon.real{background:linear-gradient(135deg,var(--success),#7bed9f)}
        .result-icon.uncertain{background:linear-gradient(135deg,var(--warning),#ffc048)}
        @keyframes verdict-bounce{
            0%{transform:scale(0.5);opacity:0}
            50%{transform:scale(1.05)}
            100%{transform:scale(1);opacity:1}
        }
        .result-info{flex:1}
        .result-label{
            font-size:28px;font-weight:800;margin-bottom:4px;
            background:linear-gradient(135deg,var(--primary),#00ff88);
            -webkit-background-clip:text;-webkit-text-fill-color:transparent;
            background-clip:text;
        }
        .result-sublabel{font-size:14px;color:var(--text2)}

        /* CONFIDENCE METER - Animated Circular Gauge */
        .confidence-section{
            display:flex;align-items:center;gap:24px;margin-bottom:24px;
            padding:20px;background:rgba(0,212,170,0.08);
            border-radius:16px;border:1px solid rgba(0,212,170,0.15);
            position:relative;z-index:1;
        }
        .confidence-gauge{
            position:relative;width:120px;height:120px;flex-shrink:0;
        }
        .gauge-bg{
            width:100%;height:100%;border-radius:50%;
            background:conic-gradient(from 0deg,var(--success) 0deg,var(--warning) 180deg,var(--danger) 360deg);
            opacity:0.15;position:absolute;
        }
        .gauge-fill{
            width:100%;height:100%;border-radius:50%;
            background:conic-gradient(from 0deg,var(--success) 0deg,var(--warning) 180deg,var(--danger) 360deg);
            opacity:0;position:absolute;
            animation:gauge-fill-animation 0.8s ease-out forwards;
        }
        @keyframes gauge-fill-animation{
            from{opacity:0}
            to{opacity:1}
        }
        .gauge-fill.ai-generated{
            background:conic-gradient(from -90deg,var(--success) 0%,var(--danger) 75%,var(--danger) 100%);
        }
        .gauge-fill.authentic{
            background:conic-gradient(from -90deg,var(--success) 0%,var(--success) 75%,var(--danger) 100%);
        }
        .gauge-inner{
            position:absolute;inset:12px;border-radius:50%;background:var(--surface);
            display:flex;flex-direction:column;align-items:center;justify-content:center;
            border:2px solid rgba(255,255,255,0.2);box-shadow:inset 0 2px 8px rgba(0,0,0,0.3);
        }
        .gauge-value{
            font-size:32px;font-weight:800;
            background:linear-gradient(135deg,var(--primary),#00ff88);
            -webkit-background-clip:text;-webkit-text-fill-color:transparent;
            background-clip:text;
        }
        .gauge-label{
            font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;
        }
        .confidence-info{flex:1}
        .confidence-info h3{font-size:16px;font-weight:700;margin-bottom:8px}
        .confidence-info p{font-size:13px;color:var(--text2);line-height:1.5;margin-bottom:12px}

        .confidence-badge{
            display:inline-flex;align-items:center;gap:4px;
            padding:6px 12px;background:var(--surface);border:1px solid var(--border);
            border-radius:12px;font-size:11px;font-weight:600;
        }
        .confidence-badge.confidence-high{border-color:var(--success);color:var(--success);background:rgba(46,213,115,0.08)}
        .confidence-badge.confidence-medium{border-color:var(--warning);color:var(--warning);background:rgba(255,165,2,0.08)}
        .confidence-badge.confidence-low{border-color:var(--danger);color:var(--danger);background:rgba(255,71,87,0.08)}

        /* DETECTION SCORE SPECTRUM */
        .score-spectrum{margin-bottom:24px;position:relative;z-index:1}
        .spectrum-label{display:flex;justify-content:space-between;margin-bottom:8px;font-size:12px;font-weight:600}
        .spectrum-bar{
            height:12px;background:var(--surface2);border-radius:6px;overflow:hidden;
            position:relative;box-shadow:inset 0 2px 4px rgba(0,0,0,0.3);
        }
        .spectrum-fill{
            height:100%;background:linear-gradient(90deg,var(--success) 0%,var(--warning) 50%,var(--danger) 100%);
            width:0%;animation:spectrum-fill 1s ease-out forwards;position:relative;
        }
        @keyframes spectrum-fill{
            from{width:0%}
            to{width:var(--fill-width,50%)}
        }
        .spectrum-marker{
            position:absolute;width:3px;height:16px;background:var(--text);
            left:var(--marker-pos,50%);top:-2px;transform:translateX(-50%);
            border-radius:1px;box-shadow:0 0 8px rgba(255,255,255,0.5);
        }
        .spectrum-hint{font-size:11px;color:var(--text3);margin-top:8px}
        .result-score{margin-bottom:12px}
        .score-bar{height:8px;background:var(--surface2);border-radius:4px;overflow:hidden}
        .score-fill{height:100%;border-radius:4px;transition:width .5s}
        .score-fill.fake{background:linear-gradient(90deg,var(--danger),#ff6b7a)}
        .score-fill.real{background:linear-gradient(90deg,var(--success),#7bed9f)}
        .score-fill.uncertain{background:linear-gradient(90deg,var(--warning),#ffc048)}
        .score-labels{display:flex;justify-content:space-between;margin-top:4px;font-size:9px;color:var(--text3)}
        .score-value{text-align:center;font-size:13px;font-weight:700;margin-top:6px}

        /* MODULE BREAKDOWN - Card Layout */
        .modules-section{margin-bottom:24px;position:relative;z-index:1}
        .modules-title{
            font-size:14px;font-weight:700;margin-bottom:12px;
            display:flex;align-items:center;gap:8px;
        }
        .modules-grid{
            display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;
        }
        .module-card{
            background:var(--surface2);border:1px solid var(--border);
            border-radius:14px;padding:14px;text-align:center;cursor:pointer;
            transition:all 0.3s cubic-bezier(.34,1.56,.64,1);position:relative;overflow:hidden;
        }
        .module-card::before{
            content:'';position:absolute;inset:0;
            background:linear-gradient(135deg,rgba(0,212,170,0.1),transparent);
            opacity:0;transition:opacity 0.3s;
        }
        .module-card:hover{
            border-color:var(--primary);background:rgba(0,212,170,0.08);transform:translateY(-4px);
        }
        .module-card:hover::before{opacity:1}
        .module-icon{font-size:28px;margin-bottom:8px}
        .module-name{font-size:12px;font-weight:600;margin-bottom:8px;color:var(--text)}
        .module-score{display:flex;align-items:center;justify-content:center;gap:4px;font-size:11px;color:var(--text2)}
        .module-indicator{
            width:6px;height:6px;border-radius:50%;
            animation:pulse-indicator 2s ease-in-out infinite;
        }
        .module-indicator.triggered{background:var(--danger)}
        .module-indicator.caution{background:var(--warning)}
        .module-indicator.clear{background:var(--success)}
        @keyframes pulse-indicator{
            0%,100%{opacity:1;transform:scale(1)}
            50%{opacity:0.6;transform:scale(1.3)}
        }
        .module-details{
            display:none;padding:12px;background:var(--surface);border-radius:10px;
            font-size:12px;margin-top:8px;border-left:3px solid var(--primary);
            animation:slideDown 0.3s ease-out;
        }
        .module-details.expanded{display:block}
        @keyframes slideDown{
            from{opacity:0;transform:translateY(-10px)}
            to{opacity:1;transform:translateY(0)}
        }
        .module-detail-row{display:flex;justify-content:space-between;margin-bottom:8px}
        .module-detail-label{color:var(--text3);font-weight:500}
        .module-detail-value{color:var(--text2);font-weight:600}'''

# Replace CSS
content = re.sub(old_css, new_css, content, flags=re.MULTILINE)

# Save the modified file
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ CSS updated successfully")
print("Next: Update HTML structure")
