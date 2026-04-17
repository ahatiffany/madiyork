import chapter1 from "@/assets/chapter-1.jpg";
import chapter2 from "@/assets/chapter-2.jpg";
import chapter3 from "@/assets/chapter-3.jpg";
import type { ChapterData } from "@/components/memoir/Chapter";

/**
 * Sample chapters used while WordPress integration is pending.
 * Each entry mirrors the shape we'll later receive from the
 * WordPress.com REST API (title, excerpt, featured image, tag → 3D).
 */
export const chapters: ChapterData[] = [
  {
    number: "Chapter One",
    title: "The Letters I Never Sent",
    pullQuote:
      "Some words you keep because sending them would have changed everything. Others you keep because they already did.",
    body: [
      "There is a wooden box on the highest shelf of my closet that I have moved across four apartments and one ocean. Inside are the letters I wrote and never sent — to my father after the divorce, to a boy in Lisbon whose last name I forgot, to versions of myself I no longer recognize.",
      "I used to think the unsent letter was a failure of nerve. Now I think it is its own kind of honesty — a place where the truth could live without consequence, until I was ready to live with it.",
    ],
    image: chapter1,
    imageAlt: "Vintage typewriter and handwritten letters on a wooden desk by a rain-streaked window",
    imageCaption: "From the writing room · Brooklyn, 2019",
    is3D: false,
  },
  {
    number: "Chapter Two",
    title: "A City Held in the Dark",
    pullQuote:
      "Lisbon taught me that a place can grieve with you, and that grief, given a cobblestone, can almost feel like home.",
    body: [
      "I arrived in Lisbon the autumn after my mother died, with one suitcase and a map I never opened. The apartment I had rented sight-unseen looked out over a tiled square where, every evening at seven, an old man in a navy coat would walk three slow loops and then disappear.",
      "I did not write for a long time. I walked. I learned the names of the trees and the difference between the rain that came from the sea and the rain that came from the hills. The city held me the way a stranger holds a stranger's child on a crowded train — briefly, kindly, and without questions.",
    ],
    image: chapter2,
    imageAlt: "Empty rain-soaked cobblestone street with glowing amber streetlamps at night",
    imageCaption: "Alfama, after the rain",
    is3D: true,
  },
  {
    number: "Chapter Three",
    title: "What the Lake Returned",
    pullQuote:
      "The water gave back nothing of what I lost, and everything of what I had not yet learned to want.",
    body: [
      "We rented the cabin for a week and stayed for the whole of August. There was no signal, no clock that worked, and a rowboat tied to a half-rotten dock that my daughter named Persephone for reasons she would not explain.",
      "Each morning I rowed out into the mist before anyone was awake. I did not bring a notebook. I did not bring anything. I sat in the middle of that small lake and waited, the way you wait for a friend who is always late but always comes — until, one morning, the words came back.",
    ],
    image: chapter3,
    imageAlt: "Lone wooden rowboat on a misty mountain lake at dawn with a faint sunrise glow",
    imageCaption: "Lake Saranac · August",
    is3D: true,
  },
];
