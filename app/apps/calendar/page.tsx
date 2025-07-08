"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"

interface Event {
  id: string
  title: string
  date: string
  time: string
  color: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "QRP v2.0 Launch",
      date: "2025-01-09",
      time: "10:00",
      color: "from-orange-500 to-blue-500",
    },
    {
      id: "2",
      title: "Code Review",
      date: "2025-01-10",
      time: "14:00",
      color: "from-green-500 to-teal-500",
    },
  ])

  const { user } = useAuth()

  useEffect(() => {
    if (user && !user.isGuest) {
      loadEventsFromDB()
    }
  }, [user])

  const loadEventsFromDB = async () => {
    try {
      const response = await fetch("/api/calendar/events")
      if (response.ok) {
        const data = await response.json()
        setEvents(
          data.map((event) => ({
            ...event,
            date: event.event_date,
            time: event.event_time,
          })),
        )
      }
    } catch (error) {
      console.error("Failed to load events:", error)
    }
  }

  const monthNames = [
    "Januari",
    "Februari",
    "Maart",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Augustus",
    "September",
    "Oktober",
    "November",
    "December",
  ]

  const dayNames = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.date === date)
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dateString = formatDate(date)
      const dayEvents = getEventsForDate(dateString)
      const isToday = dateString === formatDate(new Date())
      const isSelected = selectedDate && dateString === formatDate(selectedDate)

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-12 flex flex-col items-center justify-center cursor-pointer rounded-lg transition-all ${
            isToday
              ? "bg-gradient-to-r from-orange-500 to-blue-500 text-white"
              : isSelected
                ? "bg-gray-600 text-white"
                : "hover:bg-gray-700 text-gray-300"
          }`}
        >
          <span className="text-sm font-medium">{day}</span>
          {dayEvents.length > 0 && (
            <div className="flex space-x-1 mt-1">
              {dayEvents.slice(0, 2).map((event, index) => (
                <div key={index} className="w-1 h-1 bg-orange-400 rounded-full"></div>
              ))}
            </div>
          )}
        </div>,
      )
    }

    return days
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800 mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mr-3">
                <span className="text-white text-lg">📅</span>
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">Kalender</h1>
                <p className="text-gray-400 text-sm">
                  {user?.isGuest ? "Gastmodus - niet opgeslagen" : "Evenementen worden gesynchroniseerd"}
                </p>
              </div>
            </div>
          </div>

          {/* Calendar Header */}
          <Card className="bg-black/30 backdrop-blur-sm border-white/10 mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Button onClick={previousMonth} variant="ghost" size="icon" className="text-white hover:bg-gray-700">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-white text-xl font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <Button onClick={nextMonth} variant="ghost" size="icon" className="text-white hover:bg-gray-700">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day names */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-gray-400 text-sm font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
            </CardContent>
          </Card>

          {/* Selected Date Events */}
          {selectedDate && (
            <Card className="bg-black/30 backdrop-blur-sm border-white/10 mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">
                  {selectedDate.toLocaleDateString("nl-NL", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getEventsForDate(formatDate(selectedDate)).length > 0 ? (
                  <div className="space-y-3">
                    {getEventsForDate(formatDate(selectedDate)).map((event) => (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg bg-gradient-to-r ${event.color} bg-opacity-20 border border-white/10`}
                      >
                        <div className="text-white font-medium">{event.title}</div>
                        <div className="text-gray-300 text-sm">{event.time}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-4">Geen evenementen voor deze dag</div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Upcoming Events */}
          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center">Aankomende Evenementen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-lg bg-gradient-to-r ${event.color} bg-opacity-20 border border-white/10`}
                  >
                    <div className="text-white font-medium">{event.title}</div>
                    <div className="text-gray-300 text-sm">
                      {new Date(event.date).toLocaleDateString("nl-NL")} om {event.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
