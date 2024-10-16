import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { SocialIcon } from "react-social-icons";


export default function FooterComponent() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
        <div className="w-full max-w-7xl mx-auto">
            <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                <div className="mt-5">
                    <Link
                        to="/"
                        className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
                    >
                        <span className="px-2 py-1 mr-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                            Yu's
                        </span>
                        Blog
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                    <div>
                    <Footer.Title title="About" />
                    <Footer.LinkGroup col>
                        <Footer.Link
                            href="https://www.100jsprojects.com"
                            target='_blank'
                            rel="noopener noreferrer"
                        >
                            100 JS Projects
                        </Footer.Link>
                        <Footer.Link
                            href="/about"
                            target='_blank'
                            rel="noopener noreferrer"
                        >
                            Yu's Blog
                        </Footer.Link>
                    </Footer.LinkGroup>
                    </div>

                    <div>
                    <Footer.Title title="Follow Us" />
                    <Footer.LinkGroup col>
                        <Footer.Link
                            href="https://www.github.com/serenayusun"
                            target='_blank'
                            rel="noopener noreferrer"
                        >
                            github
                        </Footer.Link>
                        <Footer.Link
                            href="#"
                            target='_blank'
                            rel="noopener noreferrer"
                        >
                            Discord
                        </Footer.Link>
                    </Footer.LinkGroup>
                    </div>

                    <div>
                    <Footer.Title title="Legal" />
                    <Footer.LinkGroup col>
                        <Footer.Link
                            href="https://www.100jsprojects.com"
                            target='_blank'
                            rel="noopener noreferrer"
                        >
                            Privacy Policy
                        </Footer.Link>
                        <Footer.Link
                            href="#"
                            target='_blank'
                            rel="noopener noreferrer"
                        >
                            Terms &amp; Conditions
                        </Footer.Link>
                    </Footer.LinkGroup>
                    </div>

                </div>

            </div>

            <Footer.Divider />
            <div>
                <Footer.Copyright href="#" by="Yu's Blog" year={new Date().getFullYear()}/>
                <div className="flex gap-6 mt-4 sm:justify-center">
                    <SocialIcon network="github" url="https://github.com" style={{ width: 25, height: 25 }}/>
                    <SocialIcon network="twitter" url="#" style={{ width: 25, height: 25 }}/>
                    <SocialIcon network="facebook" url="#" style={{ width: 25, height: 25 }}/>
                    <SocialIcon network="instagram" url="#" style={{ width: 25, height: 25 }}/>
                    <SocialIcon network="discord" url="#" style={{ width: 25, height: 25 }}/>
                </div>
            </div>

        </div>
    
    </Footer>
  )
}
