import LinkEditor from "./tools/link";
import BasicEditor from "./tools/basic";
import ImageEditor from "./tools/image";
import EmbedEditor from "./tools/embed";
import InlineEditor from "./tools/inline";
import HeadlineEditor from "./tools/headline";

export default function ToolsFactory() {

  const link = LinkEditor();
  const basic = BasicEditor();
  const embed = EmbedEditor();
  const image = ImageEditor();
  const inline = InlineEditor();
  const headline = HeadlineEditor();

  const editors = {
    "italic" : inline,
    "strong" : inline,
    "strike" : inline,

    "#" : headline,
    "##" : headline,
    "###" : headline,
    "####" : headline,
    "#####" : headline,
    "######" : headline,

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
    }
  }
}