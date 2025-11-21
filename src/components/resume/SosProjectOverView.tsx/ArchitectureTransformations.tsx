import { Illustration, IntroPoint, Section } from "./structural"

const ArchitectureTransformations = () => {
  return (
    <Section className="flex flex-col gap-6">
      <IntroPoint title="#2">
        <h2 className="text-2xl font-normal font-serif mt-10 mb-2">
          Architecture transformations
        </h2>
        <p className="text-secondary">Finding common ground</p>
      </IntroPoint>
      <IntroPoint title="Problem">
        <div className="flex flex-col gap-6">
          The initial Project Overview layout presented challenges for clients during the professional selection process. Usability interviews and user recordings revealed difficulties in:
          <div className="p-6 bg-background-07 rounded-3xl">
            <h3 className="font-mono uppercase mb-2">Distinguishing contacted professionals</h3>
            The overall layout felt cluttered and overwhelming, hindering clear decision-making.
          </div>
          <div className="p-6 bg-background-07 rounded-3xl">
            <h3 className="font-mono uppercase mb-2">Information overload</h3>
            A single list of all professionals with more distinctive cards, clearly divided by the level of interaction.
          </div>
          <Illustration
            src={"/img/resume/sos-project-overview/project-overview-initial.png"}
            caption={"Initial version of page structure"}
          />
        </div>
      </IntroPoint>

      <IntroPoint title="Process">
        <div className="flex flex-col gap-6">
          To address these issues, the CTO and I developed two contrasting hypotheses for improving the layout:
          <div className="p-6 bg-background-07 rounded-3xl">
            <h3 className="font-mono uppercase mb-2">CTO's</h3>
            Maintain the single-page structure but enhance the distinctiveness of professional groups based on interaction level (contacted, applied, etc.)
          </div>
          <div className="p-6 bg-background-07 rounded-3xl">
            <h3 className="font-mono uppercase mb-2">Mine</h3>
            Divide the list of professionals by purpose:
            <ul className="list-disc ml-5 space-y-2">
              <li>The "Project space" screen dedicated to communication, showcasing professionals the client has already messaged.</li>
              <li>The "Find professionals" screen for, evidently, finding professionals, displaying all other relevant professionals</li>
            </ul>
          </div>
          Through iterating and analysing results in various scenarios, we arrived at a hybrid solution. This combined the strengths of both hypotheses and addressed user needs more effectively:
          <div className="p-6 bg-background-07 rounded-3xl">
            <h3 className="font-mono uppercase mb-2">Introduction of Tabs:</h3>
            Divide the list of professionals by purpose:
            <ul className="list-disc ml-5 space-y-2">
              <li>"Inbox": Clearly displays contacted professionals and those who applied to the request.</li>
              <li>"All professionals": Lists all other relevant professionals corresponding to the client's request.</li>
            </ul>
          </div>
          <div className="p-6 bg-background-07 rounded-3xl">
            Introduction of redirection and display conditions to treat different use cases in a more efficient manner.
          </div>
          <Illustration
            src={"/img/resume/sos-project-overview/architecture.png"}
            caption={"Rought final structure"}
          />
        </div>
      </IntroPoint>

      <IntroPoint title="Results">
        <div className="flex flex-col gap-6">
          This hybrid layout provided a clearer distinction between communication stages and improved information organisation, ultimately optimising the user experience for client decision-making.
          <Illustration
            src={"/img/resume/sos-project-overview/project-overview-initial.png"}
            caption={"We started to use a pop-up for initial message instead of redirection to the chat page"}
          />
          It resulted in increased client engagements with professionals and better usability tests feedback.
          <div className="flex gap-12">
            <div className="flex flex-col gap-1">
              <p className="text-secondary">
                Conversion to open profile
              </p>
              <p className="text-2xl font-medium font-mono">
                85% increase
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-secondary">
                Conversations with pros started
              </p>
              <p className="text-2xl font-medium font-mono">
                70% increase
              </p>
            </div>
          </div>
        </div>
      </IntroPoint>
    </Section>
  )
}

export default ArchitectureTransformations
