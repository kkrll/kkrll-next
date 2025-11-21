import { IntroPoint } from "./structural"

const Intro = () => {
  return (
    <section className="flex flex-col gap-6">
      <div className="grid-1-to-3">
        <div />
        <div>
          <h1 className="text-4xl font-normal font-serif mt-10 mb-2">Project Overiew page redesign</h1>
          <p className="text-secondary">StarOfService, 2023</p>
        </div>
      </div>
      <IntroPoint title="Problem" > After the business model switch, the Project Overview page became a part of the primary client funnel. Usability tests and metrics performance highlighted room for growth.</IntroPoint>
      <IntroPoint title="Role" > Ideated, researched, designed, and implemented experiments to redesign the user journey and increase page conversion.</IntroPoint>
      <IntroPoint title="Goal and results" > The main goal was to increase client engagement with professionals on this page.</IntroPoint>
      <IntroPoint > Over about 6 months of iterations, the share of Clients starting communication with Professionals increased almost 4 times. On the scale of the entire funnel it can be estimated as x2.2 growth.</IntroPoint>
      <div className="grid-1-to-3">
        <div />
        <div className="flex gap-12">
          <div className="flex flex-col gap-1">
            <p className="text-secondary">Target page conversion</p>

            <p className="text-2xl font-medium font-mono">x4 increase</p>
          </div>
          <div className="flex flex-col gap-1">

            <p className="text-secondary">Entire funnel covertion</p>

            <p className="text-2xl font-medium font-mono">x2.2 increase</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Intro
