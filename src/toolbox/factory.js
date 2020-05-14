import LinkEditor from "./tools/link";
import BasicEditor from "./tools/basic";
import ImageEditor from "./tools/image";
import EmbedEditor from "./tools/embed";

export default function ToolsFactory() {

  const link = LinkEditor();
  const basic = BasicEditor();
  const embed = EmbedEditor();
  const image = ImageEditor();

  const editors = {
    "italic" : basic,
    "strong" : basic,
    "strike" : basic,

    "#" : basic,
    "##" : basic,
    "###" : basic,
    "####" : basic,
    "#####" : basic,
    "######" : basic,

    "quote": basic,
    "upper": basic,
    "line": basic,

    "link": link,

    "img": image,
    "embed": embed,
  };

  return {
    getEditor: (type, target) => {
      const editor = editors[type] || basic;
      return editor(target);
    },
  };
}