"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, FileText, Mail, Phone, MapPin, Linkedin, Github, Globe, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import html2pdf from "html2pdf.js"

interface CVPreviewOverlayProps {
    isOpen: boolean
    onClose: () => void
    profileData: {
        personalInfo: {
            fullName: string
            email: string
            phone: string
            location: string
            linkedin: string
            github: string
            portfolio: string
        }
        summary: string
        skills: string[]
        loopLabSkills: string[]
        experiences: Array<{
            title: string
            company: string
            timeline: string
            description: string
        }>
        education: Array<{
            school: string
            course: string
            year: string
        }>
        projects: Array<{
            title: string
            techStack: string[]
            summary: string
        }>
    }
}

export function CVPreviewOverlay({ isOpen, onClose, profileData }: CVPreviewOverlayProps) {
    const cvRef = useRef<HTMLDivElement>(null)
    const [isDownloading, setIsDownloading] = useState(false)

    if (!isOpen) return null

    const allSkills = [...new Set([...profileData.skills, ...profileData.loopLabSkills])]

    const handleDownloadPDF = async () => {
        if (!cvRef.current) return

        setIsDownloading(true)
        try {
            const opt = {
                margin: 0,
                filename: `${profileData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }

            await html2pdf().set(opt).from(cvRef.current).save()
        } catch (error) {
            console.error('Error generating PDF:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
                >
                    {/* Header Bar */}
                    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
                        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-bold">CV Preview</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={handleDownloadPDF}
                                    disabled={isDownloading}
                                >
                                    {isDownloading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4" />
                                            Download PDF
                                        </>
                                    )}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={onClose}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* CV Content - Centered A4 style */}
                    <div className="container mx-auto px-4 py-8 flex justify-center">
                        <motion.div
                            ref={cvRef}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="w-full max-w-[800px] bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden"
                        >
                            {/* CV Header */}
                            <div className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6 lg:p-8 border-b border-gray-200">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                    {profileData.personalInfo.fullName || "Your Name"}
                                </h1>
                                <div className="flex flex-wrap gap-2 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
                                    {profileData.personalInfo.email && (
                                        <span className="flex items-center gap-1.5">
                                            <Mail className="h-4 w-4" /> {profileData.personalInfo.email}
                                        </span>
                                    )}
                                    {profileData.personalInfo.phone && (
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="h-4 w-4" /> {profileData.personalInfo.phone}
                                        </span>
                                    )}
                                    {profileData.personalInfo.location && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="h-4 w-4" /> {profileData.personalInfo.location}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600">
                                    {profileData.personalInfo.linkedin && (
                                        <span className="flex items-center gap-1.5">
                                            <Linkedin className="h-4 w-4" /> {profileData.personalInfo.linkedin}
                                        </span>
                                    )}
                                    {profileData.personalInfo.github && (
                                        <span className="flex items-center gap-1.5">
                                            <Github className="h-4 w-4" /> {profileData.personalInfo.github}
                                        </span>
                                    )}
                                    {profileData.personalInfo.portfolio && (
                                        <span className="flex items-center gap-1.5">
                                            <Globe className="h-4 w-4" /> {profileData.personalInfo.portfolio}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* CV Body */}
                            <div className="p-4 sm:p-6 lg:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                                    {/* Left Column - Skills & Education */}
                                    <div className="space-y-8">
                                        {allSkills.length > 0 && (
                                            <section>
                                                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4 border-b border-gray-200 pb-2">
                                                    Skills
                                                </h2>
                                                <div className="flex flex-wrap gap-2">
                                                    {allSkills.map((skill) => (
                                                        <Badge
                                                            key={skill}
                                                            variant="secondary"
                                                            className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        >
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {profileData.education.length > 0 && (
                                            <section>
                                                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4 border-b border-gray-200 pb-2">
                                                    Education
                                                </h2>
                                                <div className="space-y-4">
                                                    {profileData.education.map((edu, i) => (
                                                        <div key={i}>
                                                            <p className="font-semibold text-sm">{edu.school}</p>
                                                            <p className="text-xs text-gray-600">{edu.course}</p>
                                                            {edu.year && <p className="text-xs text-gray-500 mt-1">{edu.year}</p>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}
                                    </div>

                                    {/* Right Column - Summary, Experience, Projects */}
                                    <div className="md:col-span-2 space-y-6 sm:space-y-8">
                                        {profileData.summary && (
                                            <section>
                                                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4 border-b border-gray-200 pb-2">
                                                    Professional Summary
                                                </h2>
                                                <p className="text-sm text-gray-700 leading-relaxed">{profileData.summary}</p>
                                            </section>
                                        )}

                                        {profileData.experiences.length > 0 && (
                                            <section>
                                                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4 border-b border-gray-200 pb-2">
                                                    Experience
                                                </h2>
                                                <div className="space-y-5">
                                                    {profileData.experiences.map((exp, i) => (
                                                        <div key={i}>
                                                            <div className="flex justify-between items-start">
                                                                <p className="font-semibold text-sm">{exp.title}</p>
                                                                {exp.timeline && (
                                                                    <span className="text-xs text-gray-500">{exp.timeline}</span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-600">{exp.company}</p>
                                                            {exp.description && (
                                                                <p className="text-xs text-gray-700 mt-2 leading-relaxed">
                                                                    {exp.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {profileData.projects.length > 0 && (
                                            <section>
                                                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4 border-b border-gray-200 pb-2">
                                                    Verified Projects
                                                </h2>
                                                <div className="space-y-4">
                                                    {profileData.projects.slice(0, 5).map((project, i) => (
                                                        <div key={i}>
                                                            <p className="font-semibold text-sm">{project.title}</p>
                                                            <p className="text-xs text-gray-500">{project.techStack.join(" • ")}</p>
                                                            <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                                                                {project.summary}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* CV Footer */}
                            <div className="bg-gray-50 px-8 py-4 text-center text-xs text-gray-500 border-t border-gray-200">
                                Generated via LoopLab • Projects verified through platform
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
