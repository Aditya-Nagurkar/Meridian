import React, { useState, useEffect } from "react"
import { Lock, Mail, User, Phone, Sparkles, CheckCircle2 } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Modal } from "../common/Modal"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import mockUsers from "../../data/users.json"

export function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, setIsAccountOpen, user, login, register } = useStore()
  const [activeTab, setActiveTab] = useState("signin")

  useEffect(() => {
    if (user && isAuthOpen) {
      setIsAuthOpen(false)
      setIsAccountOpen(true)
    }
  }, [user, isAuthOpen, setIsAuthOpen, setIsAccountOpen])

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  // Register form state
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regError, setRegError] = useState("")

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setLoginError("")
    const res = login(loginEmail, loginPassword)
    if (!res.success) {
      setLoginError(res.error || "Invalid credentials")
    }
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    setRegError("")
    const res = register(regName, regEmail, regPassword, regPhone)
    if (!res.success) {
      setRegError(res.error || "Please complete all fields")
    }
  }

  const handleQuickDemoLogin = (user) => {
    setLoginEmail(user.email)
    setLoginPassword(user.password)
    login(user.email, user.password)
  }

  return (
    <Modal
      isOpen={isAuthOpen}
      onClose={() => setIsAuthOpen(false)}
      maxWidth="max-w-md"
      showCloseButton={true}
    >
      <div className="p-1">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 mb-3">
            <img src="/logo.png" alt="Meridian" className="h-6 w-6 object-contain" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground font-['Space_Grotesk']">
            Welcome to MERIDIAN
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Access your curated wishlist, saved addresses & order history.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>

          {/* SIGN IN TAB */}
          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="aditya@meridian.in"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <span className="text-[11px] text-muted-foreground">Demo: password123</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-xs text-red-500 font-medium">{loginError}</p>
              )}

              <Button type="submit" className="w-full font-bold shadow-md">
                Sign In
              </Button>
            </form>

            {/* Quick Demo Logins Section */}
            <div className="pt-3 border-t border-border/60">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-2.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Quick Demo Accounts (1-Click Test):</span>
              </div>

              <div className="space-y-2">
                {mockUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(u)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-border/80 bg-muted/30 hover:bg-muted/70 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="h-7 w-7 rounded-full object-cover border border-border"
                      />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                          {u.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {u.email}
                        </div>
                      </div>
                    </div>
                    <Badge variant="accent" className="text-[10px] px-2 py-0.5">
                      {u.tier}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* CREATE ACCOUNT TAB */}
          <TabsContent value="register" className="space-y-3.5">
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="reg-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="Aditya Nagurkar"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="reg-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="you@domain.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="reg-phone">Phone Number (+91)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="+91 98201 12345"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="reg-password">Password (min 6 chars)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {regError && (
                <p className="text-xs text-red-500 font-medium">{regError}</p>
              )}

              <Button type="submit" className="w-full font-bold shadow-md mt-2">
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  )
}
