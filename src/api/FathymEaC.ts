import {
  EverythingAsCode,
  EverythingAsCodeClouds,
  EverythingAsCodeGitHub,
  EverythingAsCodeIoT,
  EverythingAsCodeSources,
} from "./.deps.ts";

export type FathymEaC =
  & EverythingAsCode
  & EverythingAsCodeClouds
  & EverythingAsCodeIoT
  & EverythingAsCodeGitHub
  & EverythingAsCodeSources;
