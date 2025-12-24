# AuthenticaDetector Incident Response Plan

**Document Version:** 1.0
**Last Updated:** December 20, 2025
**Owner:** Security-Abuse Agent
**Classification:** INTERNAL USE ONLY

---

## 1. Purpose

This document outlines the procedures for detecting, responding to, and recovering from security incidents affecting the AuthenticaDetector application. The goal is to minimize damage, reduce recovery time, and protect user data.

---

## 2. Incident Severity Levels

### SEV-1: CRITICAL
**Response Time:** Immediate (within 15 minutes)
**Examples:**
- Active data breach
- Exposed API keys/secrets
- Ransomware/malware infection
- Complete service outage
- User credentials compromised

**Actions:**
- All hands on deck
- Consider service shutdown
- Engage all contacts immediately

### SEV-2: HIGH
**Response Time:** Within 1 hour
**Examples:**
- Suspected unauthorized access
- Security vulnerability actively exploited
- Significant data exposure risk
- Authentication bypass discovered

**Actions:**
- Primary responder engaged
- Assess and contain
- Notify stakeholders

### SEV-3: MEDIUM
**Response Time:** Within 4 hours
**Examples:**
- Vulnerability discovered (not yet exploited)
- Suspicious activity patterns
- Failed intrusion attempts
- Rate limiting bypassed

**Actions:**
- Investigate during business hours
- Document findings
- Plan remediation

### SEV-4: LOW
**Response Time:** Within 24 hours
**Examples:**
- Minor security improvements needed
- Audit findings
- Policy violations
- General security questions

**Actions:**
- Add to backlog
- Address in next sprint

---

## 3. Incident Response Team

### Primary Roles

| Role | Responsibility |
|------|---------------|
| **Incident Commander** | Coordinates response, makes decisions |
| **Security Lead** | Technical investigation, containment |
| **Communications Lead** | User/stakeholder notifications |
| **Technical Lead** | System changes, fixes |
| **Documentation Lead** | Records all actions taken |

### Contact Information

| Role | Name | Contact |
|------|------|---------|
| Primary Responder | [To be assigned] | [Contact] |
| Backup Responder | [To be assigned] | [Contact] |
| Supabase Support | N/A | dashboard support |
| Cloudflare Support | N/A | support portal |

---

## 4. Incident Response Phases

### Phase 1: Detection & Identification

#### Indicators of Compromise (IOCs)

**Authentication Anomalies:**
- Multiple failed login attempts (>10/hour from same source)
- Logins from unusual locations
- Password reset floods
- Session hijacking attempts

**Database Anomalies:**
- Unusual query patterns
- Mass data extraction attempts
- RLS bypass attempts
- Unexpected privilege escalation

**Application Anomalies:**
- XSS payload attempts in logs
- SQL injection patterns
- File upload violations
- Rate limit exhaustion

**Infrastructure Anomalies:**
- Unusual traffic spikes
- DDoS indicators
- CDN bypass attempts
- DNS anomalies

#### Detection Tools

1. **Supabase Dashboard**
   - Database logs
   - Auth logs
   - API usage metrics

2. **Cloudflare Dashboard**
   - WAF logs
   - Rate limiting events
   - Bot detection
   - Traffic analytics

3. **Application Logs**
   - Security audit log table
   - Console errors
   - Failed operations

### Phase 2: Containment

#### Immediate Containment Actions

**SEV-1 Containment Checklist:**
- [ ] Enable Cloudflare "Under Attack Mode"
- [ ] Rotate all exposed API keys
- [ ] Revoke all active sessions (Supabase)
- [ ] Enable maintenance mode
- [ ] Block suspicious IPs
- [ ] Disable affected features

**SEV-2 Containment Checklist:**
- [ ] Identify affected systems
- [ ] Isolate compromised accounts
- [ ] Enable additional logging
- [ ] Apply emergency patches
- [ ] Monitor for spread

### Phase 3: Eradication

#### Key Rotation Procedures

**1. Supabase Anon Key Rotation:**
```
1. Go to Supabase Dashboard > Settings > API
2. Generate new anon key
3. Update index.html with new key
4. Deploy immediately
5. Old key expires automatically
```

**2. Supabase Service Role Key Rotation:**
```
1. Go to Supabase Dashboard > Settings > API
2. Generate new service role key
3. Update all server-side configurations
4. Update CLAUDE.md (securely)
5. Deploy backend changes
```

**3. Cloudflare API Key Rotation:**
```
1. Go to Cloudflare Dashboard > My Profile > API Tokens
2. Create new API token with same permissions
3. Update all CI/CD configurations
4. Delete old token
```

**4. Supabase Management API Key:**
```
1. Go to Supabase Dashboard > Account > Access Tokens
2. Create new access token
3. Update execute_sql_with_api.js
4. Update CLAUDE.md
5. Revoke old token
```

#### Vulnerability Patching

1. Identify root cause
2. Develop fix
3. Test in isolation
4. Deploy fix
5. Verify remediation
6. Document patch

### Phase 4: Recovery

#### Service Restoration Checklist

- [ ] Verify all threats eliminated
- [ ] Confirm system integrity
- [ ] Restore from backup if needed
- [ ] Re-enable disabled features
- [ ] Disable "Under Attack Mode"
- [ ] Resume normal operations
- [ ] Continue monitoring (48 hours)

#### User Account Recovery

If user accounts compromised:
1. Force password reset for affected accounts
2. Invalidate all sessions
3. Notify affected users
4. Review account activity
5. Restore data from backup if needed

### Phase 5: Lessons Learned

#### Post-Incident Review

Within 48 hours of resolution:
- [ ] Timeline of events
- [ ] What went wrong
- [ ] What went right
- [ ] Gaps in detection
- [ ] Gaps in response
- [ ] Recommendations

#### Documentation Requirements

Create post-incident report including:
1. Executive summary
2. Detailed timeline
3. Impact assessment
4. Root cause analysis
5. Remediation actions
6. Prevention recommendations

---

## 5. Specific Incident Playbooks

### Playbook A: API Key Exposure

**Trigger:** API key found in public repository, logs, or reported

**Steps:**
1. **IMMEDIATE** - Rotate the exposed key (see Phase 3)
2. Identify exposure source
3. Revoke old key
4. Audit for unauthorized usage
5. Review access logs
6. Update security controls
7. Notify stakeholders if data accessed

### Playbook B: User Data Breach

**Trigger:** Confirmed unauthorized access to user data

**Steps:**
1. **IMMEDIATE** - Contain access (revoke tokens, block IPs)
2. Determine scope of breach
3. Identify affected users
4. Preserve evidence
5. Notify affected users (within 72 hours)
6. Report to authorities if required
7. Engage legal counsel if needed

**User Notification Template:**
```
Subject: Important Security Notice - AuthenticaDetector

Dear [User],

We are writing to inform you that we recently discovered unauthorized
access to some user data on AuthenticaDetector.

What happened:
[Brief description]

What data was involved:
[Specific data types]

What we're doing:
- [Actions taken]
- [Ongoing measures]

What you should do:
- Change your password immediately
- Review your account for suspicious activity
- [Other recommendations]

We sincerely apologize for this incident.

The AuthenticaDetector Team
```

### Playbook C: XSS Attack Detected

**Trigger:** XSS payload successfully executed or stored

**Steps:**
1. Identify affected pages/fields
2. Remove malicious content from database
3. Patch vulnerability
4. Review all similar input fields
5. Add/improve input sanitization
6. Update CSP if needed
7. Audit for data exfiltration

### Playbook D: DDoS Attack

**Trigger:** Service unavailable due to traffic flood

**Steps:**
1. Enable Cloudflare "Under Attack Mode"
2. Enable stricter rate limiting
3. Block offending IP ranges
4. Enable bot protection
5. Monitor traffic patterns
6. Scale resources if needed
7. Coordinate with Cloudflare support

### Playbook E: Coin/Badge Manipulation

**Trigger:** Unusual coin balance or badge awards detected

**Steps:**
1. Identify affected accounts
2. Freeze suspicious accounts
3. Audit transaction logs
4. Roll back illegitimate gains
5. Identify exploit method
6. Patch vulnerability
7. Update anti-cheat measures

---

## 6. Communication Templates

### Internal Status Update

```
INCIDENT STATUS UPDATE
=======================
Incident ID: INC-[DATE]-[NUMBER]
Severity: [SEV-1/2/3/4]
Status: [Investigating/Contained/Resolved]
Time: [Current time]

Summary:
[Brief description of incident]

Current Status:
[What's happening now]

Actions Taken:
- [Action 1]
- [Action 2]

Next Steps:
- [Next action]

Impact:
- Users affected: [Number]
- Services affected: [List]

Next Update: [Time]
```

### User Communication (Non-Breach)

```
Subject: Temporary Service Interruption - AuthenticaDetector

We are currently experiencing technical difficulties that may
affect some features. Our team is actively working to resolve
this issue.

Affected features:
- [List affected features]

Expected resolution: [Time estimate]

We apologize for any inconvenience.
```

---

## 7. Tools & Resources

### Emergency Access URLs

| Service | URL |
|---------|-----|
| Supabase Dashboard | https://supabase.com/dashboard/project/vrvoyxxdlcpysthzjbeu |
| Cloudflare Dashboard | https://dash.cloudflare.com/ |
| GitHub Repository | https://github.com/Sharks820/authenticadetector |
| Production Site | https://authenticadetector.com |

### Useful Commands

```bash
# Check Supabase status
curl -s https://status.supabase.com/api/v2/status.json | jq

# Check Cloudflare status
curl -s https://www.cloudflarestatus.com/api/v2/status.json | jq

# Quick database query via API
curl -X POST 'https://vrvoyxxdlcpysthzjbeu.supabase.co/rest/v1/rpc/log_security_event' \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [ACCESS_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"p_event_type": "manual_check", "p_details": {}}'
```

### Evidence Preservation

When preserving evidence:
1. Take screenshots with timestamps
2. Export relevant logs
3. Document exact steps to reproduce
4. Preserve database state (before changes)
5. Record network traffic if possible
6. Save emails/communications

---

## 8. Regulatory Considerations

### Data Breach Notification Requirements

| Jurisdiction | Timeframe | Authority |
|--------------|-----------|-----------|
| GDPR (EU) | 72 hours | Supervisory Authority |
| CCPA (California) | "Expedient" | CA Attorney General |
| General | 72 hours | Affected users |

### Documentation Retention

Keep incident documentation for:
- Minimum 3 years
- Or as required by applicable law
- Include all communications
- Include all technical evidence

---

## 9. Regular Testing

### Quarterly Exercises

- [ ] Tabletop exercise (discuss scenarios)
- [ ] Test key rotation procedures
- [ ] Verify backup restoration
- [ ] Review and update contacts
- [ ] Update playbooks as needed

### Annual Activities

- [ ] Full incident simulation
- [ ] External security audit
- [ ] Penetration testing
- [ ] Plan review and update
- [ ] Training for all team members

---

## 10. Quick Reference Card

### First 15 Minutes (SEV-1)

1. Assess and confirm incident
2. Notify incident commander
3. Enable containment measures
4. Start documentation
5. Gather response team

### Key Phone Numbers

| Contact | Purpose |
|---------|---------|
| [Primary] | Incident commander |
| [Secondary] | Backup commander |
| [Supabase] | Infrastructure support |
| [Legal] | Breach notification |

### Don't Forget

- **Document everything**
- **Communicate regularly**
- **Don't destroy evidence**
- **Ask for help if needed**
- **Take breaks (fatigue causes mistakes)**

---

## Appendix A: Incident Log Template

```
INCIDENT LOG
============

Incident ID: INC-____________
Date/Time Opened: ____________
Date/Time Closed: ____________
Severity: ____________
Status: ____________

TIMELINE:
---------
[Time] - [Event/Action]
[Time] - [Event/Action]
[Time] - [Event/Action]

ROOT CAUSE:
-----------
[Description]

IMPACT:
-------
Users affected: ____________
Data affected: ____________
Services affected: ____________
Duration: ____________

RESOLUTION:
-----------
[Description of fix]

FOLLOW-UP ACTIONS:
-----------------
[ ] [Action item]
[ ] [Action item]
[ ] [Action item]

LESSONS LEARNED:
---------------
[Key takeaways]

SIGN-OFF:
---------
Incident Commander: ____________ Date: ____________
```

---

## Appendix B: Emergency Contacts Quick Card

Print and keep accessible:

```
+------------------------------------------+
|     AUTHENTICADETECTOR EMERGENCY         |
+------------------------------------------+
| SEV-1: Call [PRIMARY] immediately        |
| SEV-2: Call within 1 hour                |
| SEV-3: Slack/email within 4 hours        |
+------------------------------------------+
| QUICK ACTIONS:                           |
| 1. Cloudflare Under Attack Mode: ON      |
| 2. Rotate Supabase keys                  |
| 3. Enable maintenance mode               |
+------------------------------------------+
| DASHBOARDS:                              |
| Supabase: supabase.com/dashboard         |
| Cloudflare: dash.cloudflare.com          |
+------------------------------------------+
```

---

*Document maintained by Security-Abuse Agent*
*Review and update quarterly*
*AuthenticaDetector 7-Agent Operating System*
