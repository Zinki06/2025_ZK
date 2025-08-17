#!/usr/bin/env python3
"""
Spring Boot REST API Demo
Spring Boot 기반 REST API 테스트 및 성능 분석 프로젝트의 Python 진입점
"""

import subprocess
import sys
import os

def check_java_installation():
    """Java 설치 상태 확인"""
    try:
        result = subprocess.run(['java', '-version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("Java 설치 확인됨")
            return True
        else:
            print("Java가 설치되지 않음")
            return False
    except FileNotFoundError:
        print("Java가 설치되지 않음")
        return False

def run_spring_boot_application():
    """Spring Boot 애플리케이션 시작"""
    print("Spring Boot 애플리케이션 시작 중...")
    try:
        # Maven을 통한 Spring Boot 실행
        subprocess.run(['mvn', 'spring-boot:run'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"애플리케이션 실행 실패: {e}")
        return False
    except FileNotFoundError:
        print("Maven이 설치되지 않음. 다음 명령어로 설치하세요:")
        print("brew install maven (macOS)")
        print("sudo apt install maven (Ubuntu)")
        return False
    
    return True

def run_tests():
    """테스트 실행"""
    print("단위 테스트 실행 중...")
    try:
        result = subprocess.run(['mvn', 'test'], capture_output=True, text=True)
        print(result.stdout)
        if result.returncode == 0:
            print("모든 테스트 통과")
            return True
        else:
            print("테스트 실패")
            print(result.stderr)
            return False
    except FileNotFoundError:
        print("Maven이 설치되지 않음")
        return False

def main():
    """진입점"""
    print("=== Spring Boot REST API Demo ===")
    print()
    
    # Java 설치 확인
    if not check_java_installation():
        print("Java 17 이상을 설치하세요.")
        sys.exit(1)
    
    # 프로젝트 디렉토리로 이동
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "test":
            # 테스트만 실행
            success = run_tests()
            sys.exit(0 if success else 1)
        
        elif command == "build":
            # 빌드만 실행
            print("프로젝트 빌드 중...")
            try:
                subprocess.run(['mvn', 'compile'], check=True)
                print("빌드 완료")
            except subprocess.CalledProcessError:
                print("빌드 실패")
                sys.exit(1)
        
        elif command == "clean":
            # 클린 빌드
            print("클린 빌드 중...")
            try:
                subprocess.run(['mvn', 'clean', 'compile'], check=True)
                print("클린 빌드 완료")
            except subprocess.CalledProcessError:
                print("클린 빌드 실패")
                sys.exit(1)
        
        else:
            print(f"알 수 없는 명령어: {command}")
            print("사용법: python main.py [test|build|clean]")
            sys.exit(1)
    
    else:
        # 기본 실행: 테스트 후 애플리케이션 실행
        print("1. 단위 테스트 실행")
        if not run_tests():
            print("테스트 실패로 인해 실행을 중단합니다.")
            sys.exit(1)
        
        print("\n2. Spring Boot 애플리케이션 실행")
        print("애플리케이션이 실행되면 http://localhost:8080/api/users 에서 API를 테스트할 수 있습니다.")
        print("종료하려면 Ctrl+C를 누르세요.")
        
        run_spring_boot_application()

if __name__ == "__main__":
    main()