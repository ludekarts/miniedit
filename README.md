# MiniEdit

Minimalistic, Markdown-based rich text editor.
To do description . . .

## Install

```
npm i @ludekarts/miniedit
```

## Usage

**With bundler:**

```
import MiniEdit from "@ludekarts/miniedit";

const editor = MiniEdit("#container");
```

**With browser:**

```
. . .
```

## MiniEdit API


### setText(markdown)

Sets full text in the editor e.g:

```
editor.setText(`
  # Hello world

  This is some paragraph of text. This one is **bold**.
`);
```

### insertText(markdown)

Insert markdown in place of the caret.


```
editor.insertText(`![myImage](https://link.to/my/image.png)`);
```

### getText()

Returns whole markdown markup from the document.

```
editor.getText();
```