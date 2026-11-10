# Photography sources

The four object-panel images are downloaded locally at 1800 x 2200 pixels, JPEG quality 90, from Unsplash's image service. They are illustrative photography for the FORME concept, not photographs of products manufactured by a real FORME studio.

| Local file | Source |
| --- | --- |
| public/images/objects/approach.jpg | https://images.unsplash.com/photo-1600210492486-724fe5c67fb0 |
| public/images/objects/curve-chair.jpg | https://images.unsplash.com/photo-1567538096630-e0c55bd6374c |
| public/images/objects/materials.jpg | https://images.unsplash.com/photo-1600607687939-ce8a6c25118c |
| public/images/objects/made-to-stay.jpg | https://images.unsplash.com/photo-1592078615290-033ee584e267 |

The original homepage photographs were downloaded from the user-supplied Figma file during initial implementation. The new object photos replace the original small chair reference in the rendered gallery. Original files are retained so prior design assets remain available.

Motion reference: https://in.pinterest.com/pin/736901557818416809/. The reference clip is used only for development inspection; it is not embedded or distributed by the website.

The expanded story sequence also uses three local 1800 x 1400 JPEG photographs (quality 90). Together with the four original Figma photographs and the materials image above, the sequence contains eight distinct interiors.

| Local file | Source |
| --- | --- |
| public/images/stories/dining-room.jpg | https://images.unsplash.com/photo-1740759546487-47ea8e32d81e ([Unsplash photo by Zoshua Colah](https://unsplash.com/photos/a-dining-room-with-a-wooden-table-and-chairs-7XvWyar6DPw)) |
| public/images/stories/quiet-living.jpg | https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a |
| public/images/stories/soft-light.jpg | https://images.unsplash.com/photo-1600210491892-03d54c0aaf87 |

## Studio background video

`public/videos/studio-aesthetic-h264.mp4` is the web copy of the user-supplied `aesthetic video.MP4`. It uses H.264 Constrained Baseline, 8-bit 4:2:0 colour, and progressive MP4 loading; its unused audio track is removed. The source upload uses HEVC/H.265 and remains unchanged outside the project. The H.264 filename also avoids reusing cached copies of the earlier video.

The studio player uses muted inline autoplay, retries when media becomes ready or the visitor touches the page, and pauses outside the section or when reduced motion is requested. The still poster is derived from the supplied film.
