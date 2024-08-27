import Footer from "@/components/Footer";
import LandingNav from "@/components/LandingNav";
import Link from "next/link";

// Heavily modified version of a V0 landing page design
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/gQas9h5GGEV
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center w-full">
      <LandingNav />
      <div className="flex-1">
        <section className="w-full py-24 xl:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Revolutionize Learning with Ambi-learn
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Ambi-learn&apos;s innovative MCQ platform delivers
                    bi-directional feedback, empowering both teachers and
                    students to achieve better learning outcomes through
                    data-driven insights.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/dashboard"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Unlock the Power of Bi-Directional Feedback
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Ambi-learn&apops;s MCQ platform provides real-time insights to
                  both teachers and students, fostering a dynamic learning
                  environment that adapts to individual needs and classroom
                  trends.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Bi-Directional Feedback
                      </h3>
                      <p className="text-muted-foreground">
                        Our platform provides instant feedback to students on
                        their performance and gives teachers valuable insights
                        into class-wide understanding.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Adaptive Learning Paths
                      </h3>
                      <p className="text-muted-foreground">
                        Ambi-learn&apops;s algorithms adjust question difficulty
                        based on individual student performance, ensuring
                        optimal challenge and growth.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Comprehensive Analytics
                      </h3>
                      <p className="text-muted-foreground">
                        Access detailed reports on student progress, question
                        efficacy, and topic mastery to inform teaching
                        strategies and curriculum development.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Support
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  We&apops;re Here to Help You Succeed
                </h2>
                <Link
                  href="#"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Contact Support
                </Link>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Privacy &amp; Security
                </div>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  At Ambi-learn, we prioritize the security and privacy of your
                  data. Our platform is fully compliant with educational data
                  protection standards, ensuring a safe learning environment for
                  all users.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
