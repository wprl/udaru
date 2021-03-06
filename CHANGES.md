
## 2.0.3 - August 24, 2017
Fixed Udaru plugin registration [commit](https://github.com/nearform/udaru/commit/c893346c026d6f87873685b70b2e0e63f475978a)
Fixed issue with reconfig package, update deps, replaced shrink wrap with package lock [commit](https://github.com/nearform/udaru/commit/8bbc13ae5ac1eeda4481a0334753683ddf858a44)

## 2.0.2 - May 26, 2017
Fixed service startup error handling: [commit](https://github.com/nearform/udaru/commit/7766f60872df8da78e2ebdaec9d1a792084d2e2c)

## 2.0.1 - April 12, 2017

## 2.0.0 - March 6, 2017

Features, enhancements, fixes:
-   **Breaking change**: replace LABS_AUTH_SERVICE with UDARU_SERVICE prefix to environment variables: [commit](https://github.com/nearform/udaru/commit/08684b1384c24afc2ed89aea0a3d3ab1cffbf511)
-   Increase user.name field length, fix org_policies.org_id: [commit](https://github.com/nearform/udaru/commit/17fee68ce15f4780dcd8e46bdeccecd55a592695)
-   Enhanced tests, documentation and examples: [commit](https://github.com/nearform/udaru/commit/298194275f46b4cff18036eb847a03d3d10d5ce5) and [commit](https://github.com/nearform/udaru/commit/f5651e03a6657d8a62b1631cc8e605e92a614e3d)

## 1.1.0 - Feb 23, 2017

Features, enhancements:
-   Added two new users endpoints for replace/delete teams: [commit](https://github.com/nearform/udaru/commit/c9ded2083b0340e1040ea72c997dd26cf38dc9b7)
-   Add 4 new organization policy management endpoints: [commit](https://github.com/nearform/udaru/commit/0049b7003ec0d8a426e0476853f12a6e6b1aa103)
-   Remove dependency on iam-js (iam-js was a wrapper for pbac): [commit](https://github.com/nearform/udaru/commit/04767e1c5a0197f6a1853ada535419086a599b19)
-   Authorization documentation: [commit](https://github.com/nearform/udaru/commit/0b1dc34a9a88834f756a6e3938612f3bee1b9c00)
-   Sql injection automated tests and sqlmap automated tests: [commit](https://github.com/nearform/udaru/commit/9e27cde1eded0de6a9170646b6972e4572786ca9)
-   Removed not used admin account: [commit](https://github.com/nearform/udaru/commit/6ef0e78d167eaf82d791648d72a21c7ce51abe9c)
-   Skip dropping the db in production env: [commit](https://github.com/nearform/udaru/commit/0da70a8a59db632296056a5ae9489b2dc8094c56)
-   Enhanced Joi validation, better error handling for existing IDs: [commit](https://github.com/nearform/udaru/commit/689550f42dcef528aefce1b34ad90e1811843f63)
-   Enhanced organization and inherited policies tests: [commit](https://github.com/nearform/udaru/commit/5ce64b5d6374e4342350d8bf000678ca1bf55815) and [commit](https://github.com/nearform/udaru/commit/ffe991088ae2a759e95f719e50f1fade95a99635)

Fixes:
-   Fixes invalid ID handling for user and policy: [commit](https://github.com/nearform/udaru/commit/90579222060070f473531e2f51890c9e74fdc4d4)


## 1.0.1 - Jan 30, 2017

Fix problem with postgrator migrations [commit](https://github.com/nearform/udaru/commit/3a1b6b1fd4dba3430f440c799334c2bf5cdb57c0)

## 1.0.0 - Jan 30, 2017

**Features**:
-   Separate udaru in 3 parts: core, plugin and server [commit](https://github.com/nearform/udaru/commit/d1625ddf91d3835aad6c70965ac4547346b886f3) , [commit](https://github.com/nearform/udaru/commit/9651465df93dfd26522d6fe0d47dcba8ebee6eee) and [commit](https://github.com/nearform/udaru/commit/a6e6aa257e188584388779278769412864baafad)
-   The `statements` parameter now is an object instead of a string [commit](https://github.com/nearform/udaru/commit/d495050026fa85502216f472648ae9484db7cc13)
-   Organization id is now optional as all other ids [commit](https://github.com/nearform/udaru/commit/611345ee1e3e56835f2de8cc309129bd077e751a)
-   Added pagination to all list endpoint [commit](https://github.com/nearform/udaru/commit/b92081b4951d2aed5d3dff30c44a98e42ee19367) , [commit](https://github.com/nearform/udaru/commit/8ae242e7f4eb48892924eee8e44e381cd26707e2) , [commit](https://github.com/nearform/udaru/commit/8c62585859d8122339ea82d5e69e7c398b6b0e64) and [commit](https://github.com/nearform/udaru/commit/611345ee1e3e56835f2de8cc309129bd077e751a) . An example for the response structure is [here](https://github.com/nearform/udaru/blob/master/lib/plugin/swagger.js#L68)
-   Added migrations script with postgrator [commit](https://github.com/nearform/udaru/commit/08abae12431e44a0ae730529a84d964364f04e45) and [commit](https://github.com/nearform/udaru/commit/a948ff18b1bf5c54b9683589a01bc94edda14892)
-   Enanche documentation [commit](https://github.com/nearform/udaru/commit/03462b3c4e6b8eaf22a6da7481d7504bf0e8e754)
-   Removed `api` and `component` folder, made the repo contain only the service app [commit](https://github.com/nearform/udaru/commit/bfd95a073752b643f81ec419c1bde0d454fe40d5)
-   Added framework for authentications tests [commit](https://github.com/nearform/udaru/commit/3f230b555ffdd7f1e1e6ccac44df41fac319ae7b) , [commit](https://github.com/nearform/udaru/commit/62de6d8ab793e54eeace1a37766d8706302a783a) , [commit](https://github.com/nearform/udaru/commit/9c0db2f885c61e31eab6ebd69de0c54de5df0d97) and [commit](https://github.com/nearform/udaru/commit/8a35b0fd7cba4e65b30a96fde289f39dc7d243bc)
-   Make a single SQL file for fixtures [commit](https://github.com/nearform/udaru/commit/a7e0948471f332592a43655fdd9adccea0438659)
-   Added bech test framework [commit](https://github.com/nearform/udaru/commit/f6014dc7e4e0f391ee495c53ecb5b07c19bd30e7)
-   Added travis for CI [commit](https://github.com/nearform/udaru/commit/3d6f33ecb67807f85254715f6a6807cbed2edf32)
-   Added MIT license [commit](https://github.com/nearform/udaru/commit/d052645183dd9150f7f63ab5a5329da6749437ac)

Fixes:
-   **Fix bug in query fetching user policies** [commit](https://github.com/nearform/udaru/commit/ae23dfd516bb541c4ef2f7f5dfa6b574cb3e4f40)
-   Fixed bug on adding a team without id [commit](https://github.com/nearform/udaru/commit/275f48bbe4088f180e3e13fd6ca81d7113f4f0b0)
-   Fixed bug on adding policies fro other organizations [commit](https://github.com/nearform/udaru/commit/540587cf8e82600b61598b32f4dcd85300981f05)
-   Fixed scoping by policies [commit](https://github.com/nearform/udaru/commit/3f64348ebea4fb536d0ab37d7d7672875c5cc405)
