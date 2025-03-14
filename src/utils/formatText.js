import { Fragment } from "react";


export const formatText = (text) => {
    // Splitting the text by sentence-ending punctuation (., !, ?)
    return text.split(/(?<=[.!?])\s+/).map((sentence, index) => (
      <Fragment key={index}>
        {sentence}
        <br /> <br />
      </Fragment>
    ));
  };