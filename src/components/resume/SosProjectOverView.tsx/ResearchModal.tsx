import Modal from "@/components/ui/modal";
import { Illustration } from "./structural";

const results = [
  "Matrix of choices based on the card's content and layout",
  "Matrics of parameters affected the dicisions, mnoticed or neglected",
  "Witnessed participants' reflections and interactions with the cards' content, patterns of Pro comparisons",
  "Received the recollections about the participants' previous hiring experience and real-life behaviour and decisions",
];

const ResearchModal = ({ close }: { close: () => void }) => {
  return (
    <Modal onClose={close}>
      <div className="flex flex-col gap-6">
        <h2>Pro cards interview</h2>
        <p>
          Pro card variants prepared for user interview The process was quite
          simple - 15 pairs of different variations of Pro Cards and then
          presented them to participants with recent hiring experience to choose
          the one they'd hire. Each time they were explaining the reasons behind
          their choice.
        </p>
        <Illustration
          src="/img/resume/sos-project-overview/procards.png"
          caption="Pro cards interview variants"
        />
        <p>
          This discussion was a great starting point to dive into their previous
          experience and real-life behaviour. Usually, the first 5-6 pairs had
          been more like a warmup before participants started to recollect the
          actual reasons behind their recent hirings, telling detailed stories
          and getting more open and excited about the whole process.
        </p>
        <p>So, in the end, we had:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {results.map((point) => {
            return (
              <div className="p-6 bg-background-07 rounded-3xl">{point}</div>
            );
          })}
        </div>
        <Illustration
          src="/img/resume/sos-project-overview/card-recomendation-example.png"
          caption="Example of recommendations"
        />
      </div>
    </Modal>
  );
};

export default ResearchModal;
