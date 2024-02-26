import {
  EverythingAsCode,
  EverythingAsCodeClouds,
  EverythingAsCodeGitHub,
  EverythingAsCodeIoT,
  EverythingAsCodeSources,
} from "@fathym/eac";

export type FathymEaC =
  & EverythingAsCode
  & EverythingAsCodeClouds
  & EverythingAsCodeIoT
  & EverythingAsCodeGitHub
  & EverythingAsCodeSources;
