The Adaptation and Assessment (TwoA) asset written in TypeScript

Authors: Enkhbold Nyamsuren
Organization: OUNL
Task: T3.4a
For any questions contact Enkhbold Nyamsuren via Enkhbold.Nyamsuren [AT] ou [DOT] nl

The package was last updated on 2017.11.07.
The package contains
- Rage Asset Manager (2016.07.27 version) in 'TwoA-TypeScript\RageAssetManager' folder
    - refer to the most recent version at https://github.com/rageappliedgame/asset-proof-of-concept-demo_TypeScript
- TwoA asset in 'TwoA-TypeScript\TwoA' folder
- Use case example coded in app.ts
    - compile (in Visual Studio) into JavaScript to run the example

Refer to the software design document (https://rage.ou.nl/filedepot?fid=501) for more implementation and integration details.
Refer to the asset use case description (https://rage.ou.nl/filedepot?fid=502) for HAT asset application notes.
Refer to the manual (https://rage.ou.nl/filedepot?fid=503) on the accompanying widget for data management and analysis/visualization.

Summary of most important changes from the previous version of the TwoA asset:
- Added a second Elo-based adaptation module that requires only player accuracy. Accuracy can be any value between 0 and 1.
- Remove dependency on external files. Now it is assumed that the game developer will add scenario and game data programatically instead of storing them in an xml file.
- Extended API for greater flexibitility of managing player and scenario data.
- Added methods to request recommended difficulty rating instead of scenario.
- Added a parameter (K factor) for scaling changes in ratings in reassessment methods.
- Added API for constructing a knowledge structure using difficulty ratings from the TwoA asset. The API also includes methods for converting the knowledge structure into a XML format.