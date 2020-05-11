export default `
  *[data-miniedit]:focus {
    outline: none;
  }

  *[data-miniedit] h1,
  *[data-miniedit] h2,
  *[data-miniedit] h3,
  *[data-miniedit] h4,
  *[data-miniedit] h5,
  *[data-miniedit] h6 {
    width: 100%;
    display: inline-block;
  }

  *[data-miniedit] h1[data-md="#"] {
    font-weight: 600;
    font-size: 1.8em;
    line-height: 1.2em;
  }

  *[data-miniedit] h2[data-md="##"] {
    font-weight: 600;
    font-size: 1.6em;
    line-height: 1.2em;
  }

  *[data-miniedit] h3[data-md="###"] {
    font-weight: 600;
    font-size: 1.4em;
    line-height: 1.2em;
  }

  *[data-miniedit] h4[data-md="####"] {
    font-size: 1em;
    margin: 0.5em 0;
    font-weight: bold;
    line-height: 1.2em;
  }

  *[data-miniedit] h5[data-md="#####"] {}

  *[data-miniedit] h6[data-md="######"] {}

  *[data-miniedit] blockquote[data-md=">"] {
    margin: 0;
    width: 100%;
    display: inline-block;
    padding: 5px 0 5px 20px;
    border-left: 3px solid #4199d5;
  }

  *[data-miniedit] figure[data-md="img"] {
    margin: 0;
    display: inline-block;
  }

  *[data-miniedit] figure[data-md="img"] > * {
    pointer-events: none;
  }

  *[data-miniedit] figure[data-md="img"] img {
    height: auto;
    display: block;
    max-width: 100%;
    margin: 1em auto;
  }

  *[data-miniedit] a[data-md="link"] {
    text-decoration:none;
  }

  *[data-miniedit] a[data-md="link"]:hover {
    text-decoration: underline;
  }

  *[data-miniedit] hr[data-md="line"] {
    height: 1px;
    border: none;
    display: block;
    margin: 1.2em 0;
    border-bottom: 1px solid #ccc;
  }

  *[data-miniedit] s[data-md="~~"] {}
  *[data-miniedit] em[data-md="*"] {}
  *[data-miniedit] sup[data-md="^"] {}
  *[data-miniedit] br[data-md="nl"] {}
  *[data-miniedit] strong[data-md="**"] {}

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
    visibility:visible;
    transform: translateZ(0);
    transition: opacity .3s ease, visibility 0s, top .4s ease, left .4s ease, transform .3s ease;
  }

  div[data-miniedit-toolbox] .toolbox-controllers button {
    width: 30px;
    height: 30px;
    border: none;
    color: white;
    background: none;
    font-weight: 500;
    display: inline-block;
    transition: box-shadow .3s ease;
    box-shadow: rgba(29, 100, 224, 0) 0px -2px 0px 0px inset;
  }

  div[data-miniedit-toolbox] .toolbox-controllers button > * {
    pointer-events: none;
  }

  div[data-miniedit-toolbox] .toolbox-controllers button:hover,
  div[data-miniedit-toolbox] .toolbox-controllers button:focus,
  div[data-miniedit-toolbox] .toolbox-controllers button.active {
    outline: none;
    box-shadow: rgb(29, 100, 224) 0px -2px 0px 0px inset;
  }

  div[data-miniedit-toolbox] .toolbox-controllers button.pressable:active {
    transform: scale(0.8);
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
`;