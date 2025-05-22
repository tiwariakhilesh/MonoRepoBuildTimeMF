

export const IframeWrapper = () => {
    return <section style={{ width: "75vw", height: "60vh" }}>
        <h1 className="mb-5">Store Location</h1>

        <iframe
            id="inlineFrameExample"
            title="Inline Frame Example"
            width="100%"
            height="100%"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&amp\\;layer=mapnik">
        </iframe>
    </section>
}

