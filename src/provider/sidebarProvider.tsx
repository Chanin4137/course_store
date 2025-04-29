'use client'
import { createContext, useContext, useState } from 'react'

interface SidebarProviderType {
    isSidebarOpen: boolean
    toggleSidebar: () => void
}

const sidebarContext = createContext<SidebarProviderType | undefined>(undefined)


export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev)


    return (
        <sidebarContext.Provider value={
            { isSidebarOpen, toggleSidebar }
        }>
            {children}
        </sidebarContext.Provider>
    )
}

export const useSidebar = () => {
    const context = useContext(sidebarContext)
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider')
    }

    return context
}