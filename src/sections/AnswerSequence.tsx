import React from "react";
import { Sequence } from "remotion";
import { Timeline } from "../lib/types";
import { AnswerCard } from "../answers/AnswerCard";
import { Theme } from "../theme/themes";

export const AnswerSequence: React.FC<{
  timeline: Timeline;
  theme: Theme;
}> = ({ timeline, theme }) => {
  return (
    <>
      {timeline.items.map((item, index) => {
        const nextItem = timeline.items[index + 1];
        const previousItem = timeline.items[index - 1];
        const previousEnd = previousItem
          ? previousItem.from + previousItem.durationInFrames
          : item.from;
        const previousRecapBeforeThis = timeline.titleCards.find(
          (card) =>
            card.reason === "recap" &&
            card.from >= previousEnd &&
            card.from < item.from
        );
        const visualFrom = previousItem
          ? previousRecapBeforeThis
            ? previousRecapBeforeThis.from + previousRecapBeforeThis.durationInFrames
            : previousEnd
          : timeline.titleCards.some((card) => card.reason === "hook")
            ? timeline.hookFrames
            : 0;
        const answerEnd = item.from + item.durationInFrames;
        const recapAfterThis = timeline.titleCards.find(
          (card) =>
            card.reason === "recap" &&
            card.from >= answerEnd &&
            (!nextItem || card.from < nextItem.from)
        );
        const visualTo = recapAfterThis
          ? recapAfterThis.from
          : nextItem
            ? nextItem.from
            : answerEnd;
        const visualDurationInFrames = visualTo - visualFrom;
        const answerStartOffsetInFrames = item.from - visualFrom;

        return (
          <Sequence
            key={item.answer.id}
            from={visualFrom}
            durationInFrames={visualDurationInFrames}
            name={`A${item.index + 1}:${item.answer.tag}`}
          >
            <AnswerCard
              item={item}
              theme={theme}
              visualDurationInFrames={visualDurationInFrames}
              answerStartOffsetInFrames={answerStartOffsetInFrames}
            />
          </Sequence>
        );
      })}
    </>
  );
};
