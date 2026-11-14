#!/usr/bin/env python3
"""
Federation Verification Script
Verifies consistency across planetary federation nodes
"""

import argparse
import sys
import requests
from typing import List, Dict, Any
import time


class FederationVerifier:
    def __init__(self, regions: List[str]):
        self.regions = regions
        self.endpoints = {
            region: f"https://sigil-{region}.sigil-os.io/api/v1"
            for region in regions
        }

    def check_node_health(self, region: str) -> bool:
        """Check if a federation node is healthy"""
        try:
            response = requests.get(
                f"{self.endpoints[region]}/health",
                timeout=5
            )
            return response.status_code == 200
        except Exception as e:
            print(f"Health check failed for {region}: {e}")
            return False

    def get_memory_hash(self, region: str) -> str:
        """Get memory fabric hash for consistency check"""
        try:
            response = requests.get(
                f"{self.endpoints[region]}/memory/hash",
                timeout=10
            )
            if response.status_code == 200:
                return response.json().get('hash', '')
        except Exception as e:
            print(f"Failed to get memory hash for {region}: {e}")
        return ''

    def get_world_model_version(self, region: str) -> str:
        """Get world model version"""
        try:
            response = requests.get(
                f"{self.endpoints[region]}/world-model/version",
                timeout=10
            )
            if response.status_code == 200:
                return response.json().get('version', '')
        except Exception as e:
            print(f"Failed to get world model version for {region}: {e}")
        return ''

    def get_federation_metrics(self, region: str) -> Dict[str, Any]:
        """Get federation metrics"""
        try:
            response = requests.get(
                f"{self.endpoints[region]}/federation/metrics",
                timeout=10
            )
            if response.status_code == 200:
                return response.json()
        except Exception as e:
            print(f"Failed to get federation metrics for {region}: {e}")
        return {}

    def verify_consistency(self) -> bool:
        """Verify consistency across all federation nodes"""
        print("\n=== Federation Consistency Verification ===\n")

        # Check health of all nodes
        print("1. Checking node health...")
        health_results = {}
        for region in self.regions:
            health_results[region] = self.check_node_health(region)
            status = "✓" if health_results[region] else "✗"
            print(f"   {status} {region}: {'Healthy' if health_results[region] else 'Unhealthy'}")

        if not all(health_results.values()):
            print("\n❌ Not all nodes are healthy. Aborting consistency check.")
            return False

        # Check memory consistency
        print("\n2. Checking memory fabric consistency...")
        memory_hashes = {}
        for region in self.regions:
            memory_hashes[region] = self.get_memory_hash(region)
            print(f"   {region}: {memory_hashes[region][:16]}...")

        unique_hashes = set(memory_hashes.values())
        if len(unique_hashes) == 1:
            print("   ✓ Memory fabric is consistent across all regions")
        else:
            print(f"   ⚠ Memory fabric divergence detected: {len(unique_hashes)} different hashes")
            return False

        # Check world model versions
        print("\n3. Checking world model versions...")
        world_model_versions = {}
        for region in self.regions:
            world_model_versions[region] = self.get_world_model_version(region)
            print(f"   {region}: {world_model_versions[region]}")

        unique_versions = set(world_model_versions.values())
        if len(unique_versions) == 1:
            print("   ✓ World models are synchronized")
        else:
            print(f"   ⚠ World model version divergence: {unique_versions}")

        # Check federation metrics
        print("\n4. Checking federation metrics...")
        for region in self.regions:
            metrics = self.get_federation_metrics(region)
            if metrics:
                print(f"   {region}:")
                print(f"     - Sync lag: {metrics.get('sync_lag_seconds', 'N/A')}s")
                print(f"     - Divergence score: {metrics.get('divergence_score', 'N/A')}")
                print(f"     - Last sync: {metrics.get('last_sync_timestamp', 'N/A')}")

        return True

    def run_sync_test(self) -> bool:
        """Test federation synchronization"""
        print("\n=== Federation Sync Test ===\n")

        # Trigger sync on all nodes
        print("Triggering sync on all nodes...")
        for region in self.regions:
            try:
                response = requests.post(
                    f"{self.endpoints[region]}/federation/sync",
                    timeout=30
                )
                print(f"   {region}: {'Sync triggered' if response.status_code == 200 else 'Failed'}")
            except Exception as e:
                print(f"   {region}: Failed to trigger sync - {e}")

        # Wait for sync to complete
        print("\nWaiting for sync to complete (60s)...")
        time.sleep(60)

        # Verify consistency
        return self.verify_consistency()


def main():
    parser = argparse.ArgumentParser(
        description="Verify SIGIL OS planetary federation"
    )
    parser.add_argument(
        "--regions",
        type=str,
        default="us-east-1,us-west-2,eu-west-1",
        help="Comma-separated list of regions"
    )
    parser.add_argument(
        "--consistency-check",
        action="store_true",
        help="Run consistency check only"
    )
    parser.add_argument(
        "--sync-test",
        action="store_true",
        help="Run full sync test"
    )

    args = parser.parse_args()
    regions = [r.strip() for r in args.regions.split(",")]

    verifier = FederationVerifier(regions)

    if args.sync_test:
        success = verifier.run_sync_test()
    else:
        success = verifier.verify_consistency()

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
