import browser from "../../Images/Screenshots/iphone-6.9/01-browser.png";
import download from "../../Images/Screenshots/iphone-6.9/02-download-sheet.png";
import saved from "../../Images/Screenshots/iphone-6.9/03-saved.png";
import pip from "../../Images/Screenshots/iphone-6.9/04-pip.png";
import background from "../../Images/Screenshots/iphone-6.9/05-background.png";
import timer from "../../Images/Screenshots/iphone-6.9/06-timer.png";
import adblock from "../../Images/Screenshots/iphone-6.9/07-adblock.png";
import organize from "../../Images/Screenshots/iphone-6.9/08-organize.png";
import trim from "../../Images/Screenshots/iphone-6.9/09-trim.png";
import vault from "../../Images/Screenshots/iphone-6.9/10-vault.png";

export const features = [
  {
    title: "Browse. Find. Save.",
    short: "Built-in browser",
    icon: "globe",
    image: browser,
    description:
      "Browse inside VidShot and save videos from supported sources.",
  },
  {
    title: "Your quality. Your folder.",
    short: "Download options",
    icon: "download",
    image: download,
    description:
      "Choose an available video quality and where your download belongs.",
  },
  {
    title: "Ready when you are.",
    short: "Offline playback",
    icon: "play",
    image: saved,
    description:
      "Open your saved videos and watch without an internet connection.",
  },
  {
    title: "Keep the video in view.",
    short: "Picture in Picture",
    icon: "pip",
    image: pip,
    description: "Watch in a floating player while you use other apps.",
  },
  {
    title: "Let it play in the background.",
    short: "Background play",
    icon: "headphones",
    image: background,
    description:
      "Keep playback going in the background or with your screen locked.",
  },
  {
    title: "Set your own pace.",
    short: "Timer & speed",
    icon: "timer",
    image: timer,
    description:
      "Adjust playback speed and set a sleep timer for your next session.",
  },
  {
    title: "A calmer way to browse.",
    short: "Ad blocker",
    icon: "shield",
    image: adblock,
    description: "Use the built-in ad blocker while browsing inside VidShot.",
  },
  {
    title: "A place for every video.",
    short: "Folders & tools",
    icon: "folder",
    image: organize,
    description:
      "Organize files in folders, rename them, and use editing, audio, and compression tools. Advanced tools require Premium.",
  },
  {
    title: "Keep the part you love.",
    short: "Video trimming",
    icon: "scissors",
    image: trim,
    description:
      "Trim a saved video to the part you want to keep. Requires Premium.",
  },
  {
    title: "Some things stay private.",
    short: "Secret Vault",
    icon: "lock",
    image: vault,
    description: "Keep private videos behind a passcode in Secret Vault.",
  },
];
