# NEXORA Omega Contracts

This repository contains the canonical contracts for NEXORA Omega. All services and clients must implement these contracts exactly.

## Structure

- `api/` - API specifications (OpenAPI, GraphQL schemas)
- `events/` - Event schemas and envelopes
- `capabilities/` - Capability definitions and schemas
- `policy/` - Policy schemas and validation rules
- `schemas/` - Shared data schemas and types
- `proto/` - Protocol Buffer definitions
- `jsonschema/` - JSON Schema definitions
- `openapi/` - OpenAPI/Swagger specifications

## Versioning

All contracts are versioned. Breaking changes require major version increments.

## Usage

Import contracts from this repository in all NEXORA Omega services and clients.

## Contract Compatibility

Services must advertise which contract version they implement. Clients must verify compatibility before connecting.