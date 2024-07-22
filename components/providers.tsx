"use client"; // This ensures the component is a client component

import { Provider } from "react-redux";
import store from "@/store/store";

const Providers = ({ children }: { children: React.ReactNode }) => {
    return <Provider store={store}>{children}</Provider>;
};

export default Providers;
