import Link from "next/link";
import Image from "next/image"
import Head from "next/head";
import Layout from "../../components/layout";

export default function FirstPost() {
    return (
        <Layout>
            <Image
                src="/images/avatar.png"
                height={144}
                width={144}
                alt="Arano"
            />
            <Head>
                <title>First Post</title>
            </Head>
            <h2>
                <Link href="/">Back to home</Link>
            </h2>
        </Layout>
    );

}