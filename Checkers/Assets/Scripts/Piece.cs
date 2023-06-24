using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Piece : MonoBehaviour
{
    public bool isWhite;
    public bool isKing;

    public bool IsForcedToMove(Piece[,] board, int pieceX, int pieceY)
    {
        if (isWhite || isKing)
        {
            // Top left
            if (pieceX >= 2 && pieceY <= 5)
            {
                Piece p = board[pieceX - 1, pieceY + 1];
                // If there is a piece, we gotta kill it.
                if (p != null && p.isWhite != isWhite)
                {
                    // Check if it's possible to land post-jump.
                    if (board[pieceX - 2, pieceY + 2] == null)
                        return true;
                }
            }

            // Top right
            if (pieceX <= 5 && pieceY <= 5)
            {
                Piece p = board[pieceX + 1, pieceY + 1];
                // If there is a piece, we gotta kill it.
                if (p != null && p.isWhite != isWhite)
                {
                    // Check if it's possible to land post-jump.
                    if (board[pieceX + 2, pieceY + 2] == null)
                        return true;
                }
            }
        }

        if (!isWhite || isKing)
        {
            // Bottom left
            if (pieceX >= 2 && pieceY >= 2)
            {
                Piece p = board[pieceX - 1, pieceY - 1];
                // If there is a piece, we gotta kill it.
                if (p != null && p.isWhite != isWhite)
                {
                    // Check if it's possible to land post-jump.
                    if (board[pieceX - 2, pieceY - 2] == null)
                        return true;
                }
            }

            // Bottom right
            if (pieceX <= 5 && pieceY >= 2)
            {
                Piece p = board[pieceX + 1, pieceY - 1];
                // If there is a piece, we gotta kill it.
                if (p != null && p.isWhite != isWhite)
                {
                    // Check if it's possible to land post-jump.
                    if (board[pieceX + 2, pieceY - 2] == null)
                        return true;
                }
            }
        }

        return false;
    }

    public bool ValidMove(Piece[,] board, int startX, int startY, int endX, int endY)
    {
        // Check if end position is empty.
        if (board[endX, endY] != null)
            return false;

        int deltaMoveX = (int)Mathf.Abs(startX - endX);
        int deltaMoveY = endY - startY;
        if (isWhite || isKing)
        {
            if (deltaMoveX == 1)
            {
                if (deltaMoveY == 1)
                    return true;
            }
            else if (deltaMoveX == 2)
            {
                if (deltaMoveY == 2)
                {
                    Piece p = board[(startX+endX)/2, (startY+endY)/2];

                    if (p != null && p.isWhite != isWhite)
                    {
                        return true;
                    }
                }
            }
        }

        if (!isWhite || isKing)
        {
            if (deltaMoveX == 1)
            {
                if (deltaMoveY == -1)
                    return true;
            }
            else if (deltaMoveX == 2)
            {
                if (deltaMoveY == -2)
                {
                    Piece p = board[(startX + endX) / 2, (startY + endY) / 2];

                    if (p != null && p.isWhite != isWhite)
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    }
    
}
