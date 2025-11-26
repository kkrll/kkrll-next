import { IntroPoint, Section } from "./structural";
import { Illustration } from "./structural";

const results = [
  "Segmentation of clients",
  "Page architecture rebuild",
  "Adjustment of the business model",
  "Optimisation of crucial elements and flows",
];

const Results = () => {
  return (
    <Section className="flex flex-col gap-6">
      <IntroPoint title="">
        <h2 className="text-2xl font-normal font-serif mt-10 mb-2">Results</h2>
      </IntroPoint>

      <IntroPoint title="">
        <div className="flex flex-col gap-6">
          <p>
            For about half a year, I have been working on the Project Overview
            page as a part of the Client funnel optimisation scope. The redesign
            included:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {results.map((point) => {
              return (
                <div key={point} className="p-6 bg-background-07 rounded-3xl">
                  {point}
                </div>
              );
            })}
          </div>
          <p>
            As a result, the share of Clients starting communication with
            Professionals increased almost in 4 times. This phenomenal number
            was partially achieved by sacrificing the next funnel step
            performance, but still, on the scale of the entire funnel, it can be
            estimated as x2.2 growth.
          </p>
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="flex flex-col gap-1">
              <p className="text-secondary">Target page conversion</p>
              <p className="text-2xl font-medium font-mono">x4 increase</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-secondary">Entire funnel conversion</p>
              <p className="text-2xl font-medium font-mono">x2.2 increase</p>
            </div>
          </div>
          <Illustration
            src={"/img/resume/sos-project-overview/results-graph.png"}
            caption={
              "The target metric progression: cumulative and devided into segments."
            }
          />
          <p>
            There were still ideas for further Project Overview page
            enhancements, but it was excluded from the Growth team scope as we
            switched to the entire Client funnel optimisation.
          </p>
        </div>
      </IntroPoint>
    </Section>
  );
};

export default Results;
