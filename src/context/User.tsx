import React, { createContext, useContext, useEffect, useState } from "react";

export type AnalistaSectionHide = {
  analisis: boolean,
  pendiente: boolean,
  finalizado: boolean,
  devuelto: boolean,
}

type UserContextType = {
  preferences: {
    sectionMaxWidth: boolean,
    analistaSectionHide: AnalistaSectionHide,
    hideHoverInfo: boolean,
    hideFooter: boolean
  },
  toggleAnalistaHide: (section: keyof AnalistaSectionHide) => void,
  toggleHoverInfo: () => void,
  toggleFooterHide: () => void,
}

export const User = createContext<UserContextType>({
  preferences: {
    hideHoverInfo: false,
    sectionMaxWidth: true,
    hideFooter: false,
    analistaSectionHide: {
      analisis: false,
      pendiente: false,
      finalizado: false,
      devuelto: false,
    }
  },
  toggleAnalistaHide: () => { },
  toggleHoverInfo: () => { },
  toggleFooterHide: () => { }
})

type Props = { children: React.ReactNode }

export const UserContext: (props: Props) => JSX.Element = ({ children }) => {
  const [preferences, setPreferences] = useState({
    sectionMaxWidth: true,
    hideHoverInfo: false,
    hideFooter: false,
    analistaSectionHide: {
      analisis: false,
      pendiente: false,
      finalizado: false,
      devuelto: false,
    }
  })

  const toggleAnalistaHide = (section: keyof AnalistaSectionHide) => {
    const newPreferences = {
      ...preferences,
      analistaSectionHide: {
        ...preferences.analistaSectionHide,
        [section]: !preferences.analistaSectionHide[section]
      }
    }
    
    setPreferences(newPreferences)

    localStorage.setItem("analistasSection", JSON.stringify(newPreferences.analistaSectionHide))
  }

  function toggleHoverInfo() {
    let hideHoverInfo = !preferences.hideHoverInfo 
    
    setPreferences({
      ...preferences,
      hideHoverInfo, 
    })

    localStorage.setItem("hideHoverInfo", JSON.stringify(hideHoverInfo))
  }

  function toggleFooterHide() {
    let hideFooter = !preferences.hideFooter;

    setPreferences({
      ...preferences,
      hideFooter,
    })

    localStorage.setItem("hideFooter", JSON.stringify(hideFooter))
  }

  useEffect(() => {
    preferences.sectionMaxWidth
      ? document.body.classList.add("ignoreSectionMaxWidth")
      : document.body.classList.remove("ignoreSectionMaxWidth")
  }, [preferences.sectionMaxWidth])

  useEffect(() => {
    localStorage.getItem("hideFooter") === "true"
      ? toggleFooterHide()
      : null;

    localStorage.getItem("hideHoverInfo") === "true"
      ? toggleHoverInfo()
      : null;

    localStorage.getItem("analistasSection") === null
      ? null
      : setPreferences({
        ...preferences,
        analistaSectionHide: JSON.parse(localStorage.getItem("analistasSection") as string)
      })
  }, [])

  return (
    <User.Provider value={{
      preferences,
      toggleAnalistaHide,
      toggleHoverInfo,
      toggleFooterHide
    }}>
      {children}
    </User.Provider>
  )
}

export const useUser = () => {
  const context = useContext(User);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}