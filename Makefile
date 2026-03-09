.PHONY: up down dev check

up:
	docker compose up -d

down:
	docker compose down -v

dev:
	pnpm dev

check:
	pnpm check
