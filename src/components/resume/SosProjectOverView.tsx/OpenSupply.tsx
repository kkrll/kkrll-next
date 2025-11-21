import { IntroPoint, Section } from "./structural"
import { Illustration } from "./structural"

const OpenSupply = () => {
  return (
    <Section className="flex flex-col gap-6">
      <IntroPoint title="#1">
        <h2 className="text-2xl font-normal font-serif mt-10 mb-2">
          Open Supply
        </h2>
        <p className="text-secondary">Design behind UI</p>
      </IntroPoint>

      <IntroPoint title="Problem">
        StarOfService encountered a challenge with limited supply. Requests for unpopular services in smaller locations often yielded no results, creating a dead end for clients and hindering the user flow.
      </IntroPoint>

      <IntroPoint title="Problem">
        <div className="flex flex-col gap-6">
          <p>Our first attempt involved expanding the search geography. However, this was poorly received by users and created a foundation of mistakes — clients were booking appointments with professionals from other cities without noticing. So, the problem required an other solution.</p>
          <Illustration
            src={"/img/resume/sos-project-overview/review.png"}
            caption={"Reviews I'm talking about"}
          />
          <p>At that moment, interactions with the client required a subscription, and there were enough professionals without one. So, we decided to start displaying them to our clients in case we lack subscribed professionals. The initiative was called "Open supply". Usually, their profiles were less compelling and fulfilled, but this approach appeared more efficient than loosening the search query.</p>
          <Illustration
            src={"/img/resume/sos-project-overview/open-supply.png"}
            caption={"Clients get access to more professionals, while we can use clients' interest to re-engage more professionals"}
          />
          <p>Also, it allowed us to use the client's interest as leverage to attract more professionals into the subscription by having a real demand instead of promises of thriving.</p>
          <p>To decrease the chances of getting no answer, we encouraged clients to contact more professionals. Apart from cheering hints, we introduced a popup with a placeholder message (or repeating the last sent), allowing clients to declare their interest in professional services in just 2 clicks. And it helped by doubling the number of clients contacting more than one professional.</p>
          <Illustration
            src={"/img/resume/sos-project-overview/contact-popup.png"}
            caption={"We started to use a pop-up for initial message instead of redirection to the chat page"}
          />
          <p>The next step, which is the introduction of bulk messaging, was postponed due to switching to the other mission.</p>
        </div>
      </IntroPoint>

      <IntroPoint title="Results">
        <div className="flex flex-col gap-6">
          This hybrid layout provided a clearer distinction between communication stages and improved information organisation, ultimately optimising the user experience for client decision-making.
          <Illustration
            src={"/img/resume/sos-project-overview/project-overview-initial.png"}
            caption={"We started to use a pop-up for initial message instead of redirection to the chat page"}
          />
          Open Supply successfully "unclogged" a significant portion of client requests and led to a noticeable increase in Project Overview conversion. While not all Open Supply professionals transitioned to subscriptions, this approach opened a valuable opportunity for client-driven conversion.
          <div className="flex gap-12">
            <div className="flex flex-col gap-1">
              <p className="text-secondary">
                Conversations with pros started
              </p>
              <p className="text-2xl font-medium font-mono">
                x2 increase
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-secondary">
                Subscriptions started within segment
              </p>
              <p className="text-2xl font-medium font-mono">
                ~70% increase
              </p>
            </div>
          </div>
        </div>
      </IntroPoint>
    </Section>
  )
}

export default OpenSupply
