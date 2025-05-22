

export const IframeWrapper = () => {
    return <section style={{ width: "75vw", height: "60vh" }}>
        <h1 className="mb-5">Wiki</h1>

        <iframe
            id="inlineFrameExample"
            title="Inline Frame Example"
            width="100%"
            height="100%"
            src="https://en.wikipedia.org/wiki/Main_Page"
            >
        </iframe>
    </section>
}

