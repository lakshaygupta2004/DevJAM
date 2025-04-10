import illustration from "@/assets/illustration.svg"
import FormComponent from "@/components/forms/FormComponent"
import Footer from "@/components/common/Footer"


function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-16 bg-devjam-light text-devjam-text dark:bg-white dark:text-devjam transition-colors">
      <div className="my-12 flex h-full min-w-full flex-col items-center justify-evenly sm:flex-row sm:pt-0">
        {/* DevJAM Illustration */}
        <div className="flex w-full animate-up-down justify-center sm:w-1/2 sm:pl-4">
          <img
            src={illustration}
            alt="DevJAM Illustration"
            className="mx-auto w-[250px] sm:w-[400px]"
          />
        </div>

        {/* Form Section */}
        <div className="flex w-full items-center justify-center sm:w-1/2">
          <FormComponent />
        </div>
      </div>

      {/* DevJAM Footer */}
      <Footer />
    </div>
  )
}

export default HomePage
