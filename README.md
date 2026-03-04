# MMM-FaceReveal

*MMM-FaceReveal* is a module for [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror)
that displays an image of a person's face along with a prompt (such as, "Who is this?") then
transitions to an image of a card that also contains the person's name and what makes them
notable.

## Screenshots

<table border="0">
  <tr>
    <td valign="top">
      <p align="center"><b>The Face Phase</b></p>
      <img src="./screenshot_1.png" width="300">
    </td>
    <td valign="top">
      <p align="center"><b>The Reveal Phase</b></p>
      <img src="./screenshot_2.png" width="300">
    </td>
  </tr>
</table>

## Installation

### Install

In your terminal, go to the modules directory and clone the repository:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/MetroCS/MMM-FaceReveal
cd MMM-FaceReveal
npm install
```

### Update

Go to the module directory and pull the latest changes:

```bash
cd ~/MagicMirror/modules/MMM-FaceReveal
git pull
npm install
```

## Configuration

To use this module, you have to add a configuration object to the modules array in the `config/config.js` file.

### Example configurations

A basic configuration for this module:
```js
    {
      module: "MMM-FaceReveal",
      position: "middle_center",
      config: {
        facesPath: "images/faces",
        cardsPath: "images/cards",
        faceSuffix: "_face",
        cardSuffix: "_card",
        faceDelayMs: 10000,
        prompts: ["Guess who?", "Recognize this face?", "Who is this?"],
        promptMode: "random",
        maxWidth: "100%"
      }
    }
```

Typical configuration:
```js
	{
	    module: "MMM-FaceReveal",
	    position: "top_center",
	    config: {
		    facesPath: "images/faces",
		    cardsPath: "images/cards",
		    faceSuffix: "_face",
		    cardSuffix: "_card",
		    prompts: ["Who is this?",
			          "Do you know who this is?",
			          "Can you identify this person?",
			          "Who is this person?"],
		    promptMode: "cycle", // "cycle" | "random"
		    faceDelayMs: 7000,
		    revealDelayMs: 9000,
		    transitionMs: 300,
		    shufflePerLoop: true,
		    maxWidth: "350px",
		    maxHeight: "500px",
		    objectFit: "contain",
	    }
	}
```


### Configuration options

| Option | Type | Default | Description |
|---|---|---|---|
| `facesPath` | `string` | `"images/faces"` | Path to face images, relative to the module directory. |
| `cardsPath` | `string` | `"images/cards"` | Path to reveal/answer images, relative to the module directory. |
| `faceSuffix` | `string` | `"_face"` | The suffix used to identify face files (e.g., `person_face.jpg`). |
| `cardSuffix` | `string` | `"_card"` | The suffix used to identify card files (e.g., `person_card.jpg`). |
| `width` | `string` | `null` | The CSS width for the image (e.g., `"300px"`). |
| `height` | `string` | `null` | The CSS height for the image (e.g., `"300px"`). |
| `maxWidth` | `string` | `100%` | The maximum CSS width allowed for the image. |
| `maxHeight` | `string` | `100%` | The maximum CSS height allowed for the image. |
| `objectFit` | `string` | `"contain"` | How the image fits its container (CSS `object-fit` property): `"contain"` or `"cover"`. |
| `prompts` | `array` | `["Who is this?"]` | A list of strings to display as during the face phase. |
| `promptMode` | `string` | `"cycle"` | Logic for choosing the next prompt: `"cycle"` or `"random"`. |
| `promptClassName`| `string` | `"mmfr-prompt"` | The CSS class name applied to the prompt text for custom styling. |
| `faceDelayMs` | `number` | `8000` | Duration (in milliseconds) the face is shown before the reveal. |
| `revealDelayMs`| `number` | `8000` | Duration (in milliseconds) the card is shown before the next pair. |
| `transitionMs` | `number` | `300` | The speed of the DOM update transition (in milliseconds). |
| `shufflePerLoop`| `boolean`| `true` | Whether to re-randomize the order of pairs after every full cycle. |

## Developer commands

- `npm install` - Install dependencies and developer tools.
- `npm run lint` - Run super-linter (JS, CSS, and Markdown).
- `npm run lint:fix` - Fix formatting and stylistic issues.
- `npm test` - Aias for the linting command

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Changelog

All notable changes to this project will be documented in the [CHANGELOG.md](CHANGELOG.md) file.
