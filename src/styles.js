export default function createStyles(namespace = "") {
  return `
    *[data-miniedit]$NS:focus {
      outline: none;
    }

    *[data-miniedit]$NS h1,
    *[data-miniedit]$NS h2,
    *[data-miniedit]$NS h3,
    *[data-miniedit]$NS h4,
    *[data-miniedit]$NS h5,
    *[data-miniedit]$NS h6 {
      display: inline-block;
    }

    *[data-miniedit]$NS h1[data-md="#"] {
      font-weight: 600;
      font-size: 1.8em;
      line-height: 1.2em;
    }

    *[data-miniedit]$NS h2[data-md="##"] {
      font-weight: 600;
      font-size: 1.6em;
      line-height: 1.2em;
    }

    *[data-miniedit]$NS h3[data-md="###"] {
      font-weight: 600;
      font-size: 1.4em;
      line-height: 1.2em;
    }

    *[data-miniedit]$NS h4[data-md="####"] {
      font-size: 1em;
      margin: 0.5em 0;
      font-weight: bold;
      line-height: 1.2em;
    }

    *[data-miniedit]$NS blockquote[data-md="quote"] {
      margin: 0;
      width: 100%;
      padding: 0.3em 1em;
      display: inline-block;
      background-color: #eee;
    }

    *[data-miniedit]$NS figure[data-md="img"],
    *[data-miniedit]$NS figure[data-md="embed"] {
      margin: 0;
      overflow: hidden;
      position: relative;
      display: inline-block;
    }

    *[data-miniedit]$NS figure[data-md="embed"]::before {
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      content: "";
      z-index: 10;
      margin-left: 5px;
      position: absolute;
      border-top: 25px solid transparent;
      border-bottom: 25px solid transparent;
      border-left: 35px solid rgba(0,0,0,0.85);
      transform: translateX(-50%) translateY(-50%);
    }

    *[data-miniedit]$NS figure[data-md="embed"]::after {
      top: 50%;
      left: 50%;
      z-index: 10;
      content: "";
      width: 110px;
      height: 110px;
      position: absolute;
      border-radius: 50%;
      border: 10px solid rgba(0,0,0,0.85);
      transform: translateX(-50%) translateY(-50%);
    }

    *[data-miniedit]$NS figure[data-md="img"] > *,
    *[data-miniedit]$NS figure[data-md="embed"] > * {
      pointer-events: none;
    }

    *[data-miniedit]$NS figure[data-md="img"] > img,
    *[data-miniedit]$NS figure[data-md="embed"] > img {
      height: auto;
      display: block;
      max-width: 100%;
      margin: 1em auto;
    }

    *[data-miniedit]$NS a[data-md="link"] {
      text-decoration:none;
    }

    *[data-miniedit]$NS a[data-md="link"]:hover {
      text-decoration: underline;
    }

    *[data-miniedit]$NS hr[data-md="line"] {
      width: 100%;
      height: 1px;
      border: none;
      margin: 1.2em 0;
      display: inline-block;
      border-bottom: 1px solid #ccc;
    }

    /* TOOLBOX */

    div[data-miniedit-toolbox] {
      opacity: 0;
      padding: 5px;
      z-index: 3500;
      position: fixed;
      overflow: hidden;
      visibility: hidden;
      border-radius: 3px;
      transform: translateZ(0);
      background-image: linear-gradient(to bottom, rgba(49,49,47,.99), #262625);
      transition: visibility 0s linear 0.3s, opacity .3s ease, top .4s ease, left .4s ease, transform .3s ease;
    }

    div[data-miniedit-toolbox].active {
      opacity: 1;
      visibility: visible;
      transform: translateZ(0);
      transition: opacity .3s ease, visibility 0s, top .4s ease, left .4s ease, transform .3s ease;
    }

    div[data-miniedit-toolbox] .toolbox-controllers .headlines {
      display: none;
    }

    div[data-miniedit-toolbox] .toolbox-controllers .headlines.active {
      display: block;
    }

    div[data-miniedit-toolbox] .toolbox-controllers button {
      width: 30px;
      height: 30px;
      border: none;
      color: white;
      cursor: pointer;
      background: none;
      font-weight: 500;
      line-height: 2em;
      font-size: 1.1rem;
      position: relative;
      display: inline-block;
      transition: box-shadow .3s ease;
      box-shadow: rgba(29, 100, 224, 0) 0px -2px 0px 0px inset;
    }

    div[data-miniedit-toolbox] .toolbox-controllers button > * {
      pointer-events: none;
    }

    div[data-miniedit-toolbox] .toolbox-controllers button:hover,
    div[data-miniedit-toolbox] .toolbox-controllers button:focus {
      outline: none;
      box-shadow: rgb(29, 100, 224) 0px -2px 0px 0px inset;
    }

    div[data-miniedit-toolbox] .toolbox-controllers button.active::before {
      top: 2px;
      left: 2px;
      right: 2px;
      bottom: 2px;
      content: "";
      border-radius: 4px;
      position: absolute;
      background-color: rgba(0,0,0,0.2);
    }

    div[data-miniedit-toolbox] .toolbox-controllers button.active::after {
      top: 3px;
      right: 3px;
      width: 5px;
      height: 5px;
      content: "";
      border-radius: 50%;
      position: absolute;
      background-color: #dc3c09;
    }

    div[data-miniedit-toolbox] .toolbox-controllers button.pressable:active {
      transform: scale(0.8);
    }

    div[data-miniedit-toolbox] .toolbox-basic {
      width: 280px;
      display: flex;
      justify-content: space-between;
    }

    div[data-miniedit-toolbox] .toolbox-buttons {
      display: flex;
      justify-content: space-between;
    }

    div[data-miniedit-toolbox] .list {
      display: flex;
      flex-direction: column;
    }

    div[data-miniedit-toolbox] .justify-right {
      display: flex;
      width: 100%;
      justify-content: flex-end;
    }

    div[data-miniedit-toolbox] .link input {
      border: none;
      padding: 3px;
      color: white;
      background: none;
      transition: box-shadow .3s ease;
      box-shadow: rgba(29, 100, 224, 0) 0px -2px 0px 0px inset;
    }

    div[data-miniedit-toolbox] .link input:hover,
    div[data-miniedit-toolbox] .link input:focus {
      outline: none;
      box-shadow: rgb(29, 100, 224) 0px -2px 0px 0px inset;
    }

    div[data-miniedit-toolbox] .link input.url {
      color: #337ab7;
    }
  `.replace(/\$NS/g, namespace);
}