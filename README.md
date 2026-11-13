# SHProject

## Viewing the Project

To view the project in your browser:

1. Open the Project

First, install all the dependencies

```bash
npm install
```

Then, build the css file

```bash
npm run build:css
```

- If you're using a live server plugin in your code editor (such as Visual Studio Code's **Live Server**), right-click on the index.html file and select "Open with Live Server" or click Go Live button at the bottom.

- Alternatively, you can simply open the index.html file in a browser to view the static content.

Open http://localhost:5500 with your browser to see the result.

2. Developing with Live Reload

If you plan to make changes to your Tailwind styles and want to see updates in real-time, run:

```bash
npm run watch:css
```

This command will watch for changes in your Tailwind CSS file and automatically rebuild output.css whenever you make changes. You can stop watching by:

```bash
ctrl + c
```

## Generated asset comparison

Pull requests build the base and head revisions in the same environment and
compare every generated HTML, JavaScript (`.js`, `.mjs`, `.cjs`), and CSS file in
`build/`. The check fails on any byte or filename difference, including asset
hashes; nothing is normalized. Changed files appear in the job summary, and the
`generated-assets-diff` artifact contains the recursive diff. Intentional output
changes therefore also fail this comparison and need review.

The comparison uses the same static-file packaging commands as deployment;
JavaScript and CSS are copied from the repository rather than compiled there.

## License

This project is licensed under the Mozilla Public License 2.0. For full license information, please see the [LICENSE](./LICENSE) file in the repository.
