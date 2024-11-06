import { Button } from "flowbite-react";


export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
        <div className="flex-1 justify-center flex flex-col" >
            <h2 className="text-2xl">
                Want to learn more about Javascript?
            </h2>
            <p className="text-gray-500 my-2 text-sm">
                Checkout these resources with 100 Javascript Projects.
            </p>
            <Button gradientDuoTone="purpleToPink" className="rounded-tl-xl rounded-bl-none">
                <a href="https://wwww.100jsprojects.com" target="_blank" rel="noopener noreferer"> 
                    100 Javascript Projects
                </a>
            </Button>
        </div>

        <div className="flex-1 p-7">
            <img src="https://stackify.com/wp-content/uploads/2018/10/JavaScript-Tutorials-for-Beginners-881x441-1.jpg" 
                alt="Learn Javascript" />
        </div>
        <div></div>
    </div>
  )
}
