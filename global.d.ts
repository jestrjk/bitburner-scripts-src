import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS } from 'react'
import * as NetDef from './NetscriptDefinitions'
declare global {
  type NS = NetDef.NS 
  type Server = NetDef.Server 
  type Player = NetDef.Player
  type ScriptArg = NetDef.ScriptArg
  type ProcessInfo = NetDef.ProcessInfo
  type AutocompleteData = NetDef.AutocompleteData 
  type RunningScript = NetDef.RunningScript
  type ServerAnalysisData = NetDef.ServerAnalysisData
}