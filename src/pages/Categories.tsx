import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle, BookOpen } from 'lucide-react'
import { listCategoriesWithCounts, type Category } from '@/lib/api'
import { CategoryCard } from '@/components/categories/CategoryCard'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Categories() {
    const navigate = useNavigate()
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await listCategoriesWithCounts()
            setCategories(data)
        } catch (error) {
            console.error('Failed to load categories:', error)
            setError('Unable to load categories. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    const handleCategoryClick = (category: Category) => {
        navigate(`/learning-paths?categoryId=${category.id}`)
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 sm:mb-12 text-center"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                        <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Browse Categories
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                        Explore learning paths across different domains. Choose a category to discover curated projects and build real-world skills.
                    </p>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-3 text-muted-foreground">Loading categories...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <Alert variant="destructive" className="max-w-2xl mx-auto">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Categories Grid */}
                {!loading && !error && categories.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <CategoryCard
                                    category={category}
                                    onClick={() => handleCategoryClick(category)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Empty State */}
                {!loading && !error && categories.length === 0 && (
                    <div className="text-center py-20">
                        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No categories available</h3>
                        <p className="text-muted-foreground">
                            Check back soon for new learning categories!
                        </p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
