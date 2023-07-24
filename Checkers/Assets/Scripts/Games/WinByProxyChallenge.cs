using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class WinByProxyChallenge : CheckersBoard 
{

    public override void Start()
    {
        whitePiecePrefab = (GameObject)Resources.Load("Prefabs/WhitePieceVariant");
        blackPiecePrefab = (GameObject)Resources.Load("Prefabs/BlackPieceVariant");
        isWhiteTurn = true;
        forcedPieces = new List<Piece>();
        isWhite = true;
        Debug.Log("You're in Challenge");
        GenerateBoard();
    }

    private protected override void CheckVictory()
    {
        // Ending the game.
        var remainingPieces = FindObjectsOfType<Piece>();
        bool hasWhite = false, hasBlack = false;

        for (int i = 0; i < remainingPieces.Length; i++)
        {
            if (remainingPieces[i].isWhite)
            {
                hasWhite = true;
            }
            else
            {
                hasBlack = true;
            }
        }

        if ((hasWhite && !hasBlack) || (hasBlack && !hasWhite))
        {
            Victory(hasWhite);
        }
        else
        {
            var remainingWhitePieces = FindObjectsOfType<Piece>().Where(p => p.isWhite);
            var remainingBlackPieces = FindObjectsOfType<Piece>().Where(p => !p.isWhite);
            bool whiteAdvantage = remainingBlackPieces.Count() < remainingWhitePieces.Count();
            var piecesToCheck = (whiteAdvantage ? remainingBlackPieces : remainingWhitePieces);

            for (int i = 0; i < piecesToCheck.Count(); i++)
            {
                if (piecesToCheck.ElementAt(i).HasMovesToPlay(pieces))
                {
                    return;
                }
            }

            Victory(whiteAdvantage);
        }
    }

    private protected List<Piece> ScanForPossibleMove(int x, int y)
    {
        forcedPieces = new List<Piece>();

        // Check just the one piece.
        if (pieces[x, y].IsForcedToMove(pieces, x, y))
            forcedPieces.Add(pieces[x, y]);

        return forcedPieces;
    }
}
