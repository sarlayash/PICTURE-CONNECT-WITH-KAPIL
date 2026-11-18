# Security Specification — Picture Connect with Kapil

## 1. Data Invariants
1. **Google-Only Genuine Identity**: Every read and write requires `request.auth != null`, `request.auth.token.email_verified == true`, and `request.auth.token.firebase.sign_in_provider == 'google.com'`. Anonymous, unverified, or password users are strictly rejected.
2. **PII Isolation**: Email addresses live exclusively inside `/users/{userId}`. Only the owner (`request.auth.uid == userId`) or the verified facilitator admin (`kapilnarula27july@gmail.com`) may read `/users/{userId}`.
3. **No Self-Privilege Escalation**: Creating `/users/{userId}` strictly requires `role == 'learner'` and forbids modifying `role`, `uid`, or `createdAt` on update.
4. **Author & Owner Binding**: Every `ConnectionPost` must bind `authorId == request.auth.uid`; every `LearnerWorkspace` and `PrepItem` must bind `ownerId == request.auth.uid`.
5. **Championship Integrity**: Only the verified facilitator admin may create, update, or delete `/teams/{teamId}`, `/teams/{teamId}/members/{memberId}`, and `/teams/{teamId}/scores/{scoreId}`. Verified learners may view live team standings.
6. **Temporal Integrity**: All `createdAt` and `updatedAt` fields must equal `request.time`.

## 2. Dirty Dozen Attack Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Read/Write**: Read `/connections` or write `/users/u1` with `request.auth == null`.
2. **Non-Google Provider**: Create `/users/u1` with `sign_in_provider: 'password'` or `'anonymous'`.
3. **Unverified Email Spoof**: Write as `kapilnarula27july@gmail.com` when `email_verified == false`.
4. **Role Escalation on Signup**: Create `/users/u1` with `role: 'admin'`.
5. **Shadow Field Injection**: Create `/connections/c1` including extra field `isFeatured: true`.
6. **Cross-User PII Read**: Authenticated learner `u2` calls `get(/users/u1)`.
7. **UID Spoofing**: Learner `u2` creates `/connections/c2` with `authorId: 'u1'`.
8. **Immutable Timestamp Tampering**: Create `/connections/c1` with client-forged `createdAt` != `request.time`.
9. **Path ID Poisoning**: Write `/connections/bad$id_with_1500_chars...` failing `isValidId()`.
10. **Score Forgery by Learner**: Learner `u2` creates `/teams/team-1/scores/s1` with `total: 100`.
11. **Oversized Payload (Denial of Wallet)**: Create `/connections/c1` with 2000-char `body` (> 600 limit).
12. **Blanket Workspace List Scraping**: Learner `u2` lists `/learnerWorkspaces` without `ownerId == 'u2'`.
