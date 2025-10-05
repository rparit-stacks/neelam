import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Phone, Send } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-balance">Get in Touch</h1>
              <p className="text-lg text-muted-foreground text-balance">
                Have questions about our courses or ebooks? We'd love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
              {/* Contact Info Cards */}
              <div className="space-y-6">
                <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">Email Us</CardTitle>
                    <CardDescription>Send us an email anytime</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href="mailto:support@helloneelammaam.com"
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      support@helloneelammaam.com
                    </a>
                  </CardContent>
                </Card>

                <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">Support</CardTitle>
                    <CardDescription>Get help with your courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">We typically respond within 24 hours</p>
                  </CardContent>
                </Card>

                <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">Online Learning</CardTitle>
                    <CardDescription>Learn from anywhere</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Access courses and ebooks globally</p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="border-blue-100">
                  <CardHeader>
                    <CardTitle className="text-2xl">Send us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Name
                          </label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            className="transition-all focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email
                          </label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            className="transition-all focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          placeholder="What is this about?"
                          className="transition-all focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          placeholder="Tell us more..."
                          rows={6}
                          className="transition-all focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full sm:w-auto group">
                        <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
