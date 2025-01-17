import { Toaster } from "@/components/ui/toaster"
import PropTypes from 'prop-types';

export default function RootLayout({ children }) {
    RootLayout.propTypes = {
        children: PropTypes.node.isRequired,
    };
    return (
        <>
            <main>{children}</main>
            <Toaster />
        </>
    )
}
