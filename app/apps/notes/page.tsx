"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Search, Edit, Trash2, Save } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  color: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")

  const colors = [
    "from-yellow-500 to-orange-500",
    "from-blue-500 to-indigo-500",
    "from-green-500 to-teal-500",
    "from-purple-500 to-pink-500",
    "from-red-500 to-orange-500",
  ]

  const { user } = useAuth()

  useEffect(() => {
    if (user && !user.isGuest) {
      loadNotesFromDB()
    } else {
      loadNotesFromLocal()
    }
  }, [user])

  const loadNotesFromDB = async () => {
    try {
      const response = await fetch("/api/notes")
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch (error) {
      console.error("Failed to load notes:", error)
    }
  }

  const loadNotesFromLocal = () => {
    const savedNotes = localStorage.getItem("qrp-notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }

  const saveNotes = async (updatedNotes: Note[]) => {
    setNotes(updatedNotes)

    if (user?.isGuest) {
      localStorage.setItem("qrp-notes", JSON.stringify(updatedNotes))
    }
    // Database saving is handled in individual functions
  }

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Nieuwe Notitie",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: colors[Math.floor(Math.random() * colors.length)],
    }

    const updatedNotes = [newNote, ...notes]
    saveNotes(updatedNotes)
    setSelectedNote(newNote)
    setEditTitle(newNote.title)
    setEditContent(newNote.content)
    setIsEditing(true)
  }

  const saveNote = async () => {
    if (!selectedNote) return

    const updatedNote = {
      ...selectedNote,
      title: editTitle || "Naamloos",
      content: editContent,
      updated_at: new Date().toISOString(),
    }

    if (user?.isGuest) {
      const updatedNotes = notes.map((note) => (note.id === selectedNote.id ? updatedNote : note))
      saveNotes(updatedNotes)
    } else {
      try {
        const response = await fetch(`/api/notes/${selectedNote.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: updatedNote.title,
            content: updatedNote.content,
            color: updatedNote.color,
          }),
        })

        if (response.ok) {
          loadNotesFromDB()
        }
      } catch (error) {
        console.error("Failed to save note:", error)
      }
    }

    setSelectedNote(updatedNote)
    setIsEditing(false)
  }

  const deleteNote = (noteId: string) => {
    if (!confirm("Weet je zeker dat je deze notitie wilt verwijderen?")) return

    const updatedNotes = notes.filter((note) => note.id !== noteId)
    saveNotes(updatedNotes)

    if (selectedNote?.id === noteId) {
      setSelectedNote(null)
      setIsEditing(false)
    }
  }

  const startEditing = (note: Note) => {
    setSelectedNote(note)
    setEditTitle(note.title)
    setEditContent(note.content)
    setIsEditing(true)
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800 mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center flex-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mr-3">
                <span className="text-white text-lg">📝</span>
              </div>
              <div className="flex-1">
                <h1 className="text-white text-xl font-bold">Notities</h1>
                <p className="text-gray-400 text-sm">
                  {user?.isGuest ? "Gastmodus - lokaal opgeslagen" : "Notities worden gesynchroniseerd"}
                </p>
              </div>
              <Button
                onClick={createNewNote}
                className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nieuw
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Notes List */}
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Zoek in notities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/30 border-white/10 text-white placeholder-gray-400"
                />
              </div>

              {/* Notes Grid */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredNotes.map((note) => (
                  <Card
                    key={note.id}
                    className={`bg-gradient-to-r ${note.color} bg-opacity-20 border-white/10 cursor-pointer transition-all hover:scale-105 ${
                      selectedNote?.id === note.id ? "ring-2 ring-orange-500" : ""
                    }`}
                    onClick={() => setSelectedNote(note)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-medium text-sm truncate flex-1">{note.title}</h3>
                        <div className="flex space-x-1 ml-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditing(note)
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNote(note.id)
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-300 text-xs line-clamp-3">{note.content || "Geen inhoud"}</p>
                      <div className="text-gray-400 text-xs mt-2">
                        {new Date(note.updatedAt).toLocaleDateString("nl-NL")}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredNotes.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    {searchTerm ? "Geen notities gevonden" : "Nog geen notities"}
                  </div>
                )}
              </div>
            </div>

            {/* Note Editor */}
            <div>
              {selectedNote ? (
                <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">
                        {isEditing ? "Notitie Bewerken" : selectedNote.title}
                      </CardTitle>
                      {!isEditing ? (
                        <Button
                          onClick={() => startEditing(selectedNote)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Bewerken
                        </Button>
                      ) : (
                        <Button
                          onClick={saveNote}
                          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Opslaan
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <>
                        <Input
                          placeholder="Titel van de notitie"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                        <Textarea
                          placeholder="Schrijf hier je notitie..."
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white min-h-[400px] resize-none"
                        />
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-gray-300 whitespace-pre-wrap min-h-[400px] p-4 bg-gray-800/50 rounded">
                          {selectedNote.content || "Deze notitie is leeg"}
                        </div>
                        <div className="text-gray-400 text-sm">
                          Aangemaakt: {new Date(selectedNote.createdAt).toLocaleDateString("nl-NL")}
                          <br />
                          Laatst bewerkt: {new Date(selectedNote.updatedAt).toLocaleDateString("nl-NL")}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <span className="text-4xl">📝</span>
                    </div>
                    <h3 className="text-white text-lg font-medium mb-2">Selecteer een notitie</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Kies een notitie uit de lijst om te bekijken of te bewerken
                    </p>
                    <Button
                      onClick={createNewNote}
                      className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nieuwe Notitie
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
