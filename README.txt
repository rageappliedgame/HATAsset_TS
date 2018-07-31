The Adaptation and Assessment (TwoA) component v1.2.5 written in TypeScript.

Authors: Enkhbold Nyamsuren
Organization: OUNL
Task: T3.4a
For any questions contact Enkhbold Nyamsuren via Enkhbold.Nyamsuren [AT] ou [DOT] nl

The package was last updated on 2018.06.18.
The package contains
- Rage Asset Manager in 'TwoA-TypeScript\RageAssetManager' folder
    - refer to the most recent version at https://github.com/rageappliedgame/asset-proof-of-concept-demo_TypeScript
- TwoA asset in 'TwoA-TypeScript\TwoA' folder
- manual
    - API documentation and use case descriptions
- Use case example coded in app.ts
    - compile (in Visual Studio) into JavaScript to run the example

Additional documentation is available at https://github.com/rageappliedgame/HatAsset/tree/1.2.5-noXML/manual.

Summary of most important changes in the version 1.2.5 of the TwoA asset:
- Added a calibration phase: during the first 30 games, changes in player and/or scenario ratings are higher due to bigger K factor (this feature is not validated; use with caution)
- Changed the name space for the TwoA asset to "TwoANS"

Summary of most important changes in the version 1.2 of the TwoA asset:
- Added a second Elo-based adaptation module that requires only player accuracy. Accuracy can be any value between 0 and 1.
- Remove dependency on external files. Now it is assumed that the game developer will add scenario and game data programatically instead of storing them in an xml file.
- Extended API for greater flexibitility of managing player and scenario data.
- Added methods to request recommended difficulty rating instead of scenario.
- Added a parameter (K factor) for scaling changes in ratings in reassessment methods.
- Added API for constructing a knowledge structure using difficulty ratings from the TwoA asset. The API also includes methods for converting the knowledge structure into a XML format.
