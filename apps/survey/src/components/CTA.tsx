export default function CTA({ title, description }: { title: string; description: string }) {
    return (
        <main className="flex h-screen w-screen bg-white">
            <div className="flex lg:w-[45%] flex-col px-12 pb-8 pt-12">
                <div className="pb-16">
                    <img src={"/images/logo.png"} alt="Logo" className="w-[197px] h-[29px]" />
                </div>

                <header className="flex flex-col gap-2 pb-10">
                    <h2 className="text-[28px] font-medium leading-normal text-[#28213B]">{title}</h2>
                    <p className="text-base">{description}</p>
                </header>

                <div className="max-w-[520px] text-black">
                    <p className="pb-10">
                        With Integraflow, you can automate, simplify, track Your ever-changing customer's journey in one
                        space.
                    </p>
                    <ul className="list-disc pl-5 pb-10 space-y-3.5">
                        <li>
                            Transform survey data into actionable insights, visualize trends, track responses, and
                            generate efficient reports with analytics tools.
                        </li>
                        <li>
                            Generate links for sharing via email, social media, or embedding in apps to easily interact
                            and collect responses.
                        </li>
                        <li>
                            Our platform seamlessly connects with a range of third-party apps, enhancing your
                            productivity.
                        </li>
                    </ul>

                    <a
                        href="https://useintegraflow.com"
                        target="_blank"
                        className="bg-black text-white px-5 py-2 inline-block rounded"
                    >
                        Learn More
                    </a>
                </div>
            </div>

            <div
                className="flex-1 flex-col justify-end rounded-b-3xl hidden lg:flex"
                style={{
                    padding: "4px",
                    border: "4px solid transparent",
                    backgroundImage: `linear-gradient(90deg, rgba(28, 15, 89, 0.30) 40%, rgba(0, 107, 41, 0.50)), url(/images/auth-bg.png), linear-gradient(rgba(0, 107, 41) 30%, rgba(28, 15, 89))`,
                    backgroundRepeat: "no-repeat, no-repeat, no-repeat",
                    backgroundPosition: "center, center, center",
                    backgroundSize: "cover, cover, cover",
                    backgroundClip: "padding-box, content-box, padding-box",
                }}
            >
                <div className="flex flex-col gap-[60px] px-[60px] pb-[60px] text-white">
                    <header className="flex flex-col gap-4">
                        <h2 className="max-w-[631px] text-[52px] font-semibold leading-[60px]">
                            Redefine customer experience with organic feedback
                        </h2>
                        <p className="max-w-[476px] text-xl ">
                            Automate. Simplify. Track Your Ever-Changing Customer&apos;s Journey in One Space
                        </p>
                    </header>

                    <div className="flex items-center gap-[14px]">
                        <div className="flex w-max">
                            <img src={"/images/profile-1.png"} className="h-10 w-10 rounded-full" alt="user" />
                            <img src={"/images/profile-2.png"} className="-ml-4 h-10 w-10 rounded-full" alt="user" />
                            <img src={"/images/profile-3.png"} className="-ml-4 h-10 w-10 rounded-full" alt="user" />
                        </div>

                        <p className="max-w-[295px] text-lg text-[#F2F2F2]]">
                            Join over <span className="text-white">(50+)</span> other businesses from around the globe
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
