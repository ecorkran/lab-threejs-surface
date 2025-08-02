
# 3D Web Development with Three.js and React Three Fiber (R3F)

## Overview
Our goal here is to create an R3F project and display it in a manta-templates card.  We can start with the ThreeJS card, and then we can add our own R3F support or card.  Ideally we can add a good one that we can port to manta-templates later.

Additionally, we're going to try to allow some configuration, which means we will experiment with UI items and form controls.  At the very minimum, our ThreeJS card will make it to manta-templates.  Almost certainly the R3F card will too.

Our goal for the card is to create an "infinite cosine surface".  Background: long (very long) ago, I created a cosine surface with hidden lines removed on an Apple IIc.  I had to learn quite a bit to do it but it was an important experience.  

I'd like to create a "world" that the user appears to be traveling across.  No vehicle for the user, just image a point of view slightly above the surface, like maybe 30-50 feet.  We want smooth animation and either we need to figure out some loop of "terrain" that goes together, or we need to generate it on the fly.  Need to evaluate the practicality of each.

We can start with some form of cosine surface.  Render in wireframe let's go super retro and do green lines on black.  the more they can look like an old CRT or the lines viewed through the scope in BattleZone the better.

## Technical Requirements
Three.js
React Three Fiber (R3F)
Manta Templates

#### Manta Templates Dependencies
React, ShadCN, Tailwind, Radix implied by manta-templates.  Currently so is NextJS, but that really shouldn't be the case.
