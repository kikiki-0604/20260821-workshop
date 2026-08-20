# ==========================================================
# AI開発ワークショップ用コンテナ
# Claude Code (CLI) が使える最小構成
# ==========================================================
FROM node:20-bookworm-slim

# 基本ツール類
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    unzip \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Claude Code CLIをグローバルインストール
RUN npm install -g @anthropic-ai/claude-code

# 作業ディレクトリ (ホストのworkspaceフォルダをマウントして使う想定)
WORKDIR /workspace

# Bedrock接続に必要な環境変数のデフォルト値
# (実際のAPIキーは docker run 時や .env ファイルで上書きする)
ENV CLAUDE_CODE_USE_BEDROCK=1
ENV AWS_REGION=ap-northeast-1
ENV ANTHROPIC_MODEL=jp.anthropic.claude-haiku-4-5-20251001-v1:0

# コンテナ起動時はbashに入る (そこから claude コマンドを実行してもらう)
CMD ["bash"]
