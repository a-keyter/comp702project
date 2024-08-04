import Footer from "@/components/Footer";
import LandingNav from "@/components/LandingNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
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
        <section className="w-full py-16 xl:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Elevate Your Assessment Game
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our AI-powered assessment platform delivers personalized evaluations, detailed analytics, and an
                    intuitive question creation interface to help you unlock the potential of your learners.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              {/* <img
                src="/placeholder.svg"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              /> */}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Unlock the Power of Personalized Assessments
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered assessment platform delivers tailored evaluations, detailed analytics, and an intuitive
                  question creation interface to help you maximize the potential of your learners.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              
              {/* <img
                src="/placeholder.svg"
                width="550"
                height="310"
                alt="Personalized Assessments"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              /> */}
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Personalized Assessments</h3>
                      <p className="text-muted-foreground">
                        Our AI algorithms analyze learner performance and tailor assessments to individual needs,
                        ensuring optimal learning outcomes.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Detailed Analytics</h3>
                      <p className="text-muted-foreground">
                        Gain deep insights into learner progress with our comprehensive reporting and analytics tools.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Intuitive Interface</h3>
                      <p className="text-muted-foreground">
                        Our user-friendly question creation interface empowers educators to easily build and manage
                        assessments.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Customers Say</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from the educators and institutions who have transformed their assessment practices with our
                  platform.
                </p>
              </div>
              <div className="grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="flex flex-col justify-between gap-4 p-6 bg-muted rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                     
                      <div>
                        <h4 className="text-lg font-semibold">Jane Doe</h4>
                        <p className="text-sm text-muted-foreground">Educator, ABC School</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      &quot;The AI-powered assessments have transformed the way\n we evaluate our students. The personalized
                      feedback\n and detailed analytics have been game-changing&quot;
                    </p>
                  </div>
                </Card>
                <Card className="flex flex-col justify-between gap-4 p-6 bg-muted rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                    
                      <div>
                        <h4 className="text-lg font-semibold">John Smith</h4>
                        <p className="text-sm text-muted-foreground">Dean, XYZ University</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      &quot;We&apos;ve been using the assessment platform for a year\n now, and it has significantly improved our
                      ability to\n identify and support struggling students.&quot;
                    </p>
                  </div>
                </Card>
                <Card className="flex flex-col justify-between gap-4 p-6 bg-muted rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div>
                        <h4 className="text-lg font-semibold">Sarah Johnson</h4>
                        <p className="text-sm text-muted-foreground">Instructional Designer, LMN Corp</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                    &quot;The intuitive question creation interface has made it\n so much easier for our team to build and
                      manage\n assessments. We&apost;re seeing better engagement and\n learning outcomes as a result.&quot;
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Pricing</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Affordable Pricing for Every Need
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose from our flexible pricing plans to find the perfect fit for your institution or organization.
                </p>
              </div>
              <div className="grid gap-4">
                <Card className="flex flex-col justify-between gap-4 p-6 bg-background rounded-lg">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Starter</h3>
                    <p className="text-4xl font-bold">$9</p>
                    <p className="text-muted-foreground">per month</p>
                    <ul className="grid gap-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-primary" />
                        Up to 100 assessments
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-primary" />
                        Basic analytics
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-primary" />
                        Limited question types
                      </li>
                    </ul>
                  </div>
                  <Button className="w-full">Get Started</Button>
                </Card>
                <Card className="flex flex-col justify-between gap-4 p-6 bg-background rounded-lg">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Pro</h3>
                    <p className="text-4xl font-bold">$29</p>
                    <p className="text-muted-foreground">per month</p>
                    <ul className="grid gap-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-primary" />
                        Unlimited assessments
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-primary" />
                        Advanced analytics
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-primary" />
                        All question types
                      </li>
                    </ul>
                  </div>
                  <Button className="w-full">Get Started</Button>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Support</div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Dedicated Support for Your Success
                </h2>
                <Link
                  href="#"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Contact Us
                </Link>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Privacy &amp; Security</div>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">We take data privacy</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer/>
    </main>
  );
}
